using System;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace QuickEditECEyedropper
{
    internal static class Program
    {
        [DllImport("user32.dll")]
        private static extern bool SetProcessDPIAware();

        [STAThread]
        private static void Main()
        {
            try { SetProcessDPIAware(); } catch { }
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new PickerForm());
        }
    }

    internal sealed class PickerForm : Form
    {
        private readonly Rectangle virtualScreen;
        private readonly Bitmap snapshot;
        private readonly string resultPath;
        private Point pointer;
        private bool finished;

        internal PickerForm()
        {
            virtualScreen = SystemInformation.VirtualScreen;
            resultPath = Path.Combine(Path.GetDirectoryName(Application.ExecutablePath), "QuickEditEC-Eyedropper.color");
            File.WriteAllText(resultPath, "WAIT");

            snapshot = new Bitmap(virtualScreen.Width, virtualScreen.Height);
            using (Graphics graphics = Graphics.FromImage(snapshot))
                graphics.CopyFromScreen(virtualScreen.Location, Point.Empty, virtualScreen.Size, CopyPixelOperation.SourceCopy);

            FormBorderStyle = FormBorderStyle.None;
            StartPosition = FormStartPosition.Manual;
            Location = virtualScreen.Location;
            ClientSize = virtualScreen.Size;
            BackgroundImage = snapshot;
            BackgroundImageLayout = ImageLayout.None;
            Cursor = Cursors.Cross;
            KeyPreview = true;
            ShowInTaskbar = false;
            TopMost = true;
            DoubleBuffered = true;
            pointer = new Point(0, 0);
        }

        protected override void OnMouseMove(MouseEventArgs e)
        {
            pointer = e.Location;
            Invalidate();
            base.OnMouseMove(e);
        }

        protected override void OnMouseDown(MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                int x = Math.Max(0, Math.Min(snapshot.Width - 1, e.X));
                int y = Math.Max(0, Math.Min(snapshot.Height - 1, e.Y));
                Color color = snapshot.GetPixel(x, y);
                File.WriteAllText(resultPath, String.Format("#{0:X2}{1:X2}{2:X2}", color.R, color.G, color.B));
                finished = true;
                Close();
            }
            else if (e.Button == MouseButtons.Right)
            {
                CancelPick();
            }
            base.OnMouseDown(e);
        }

        protected override void OnKeyDown(KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Escape)
            {
                e.Handled = true;
                CancelPick();
            }
            base.OnKeyDown(e);
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            int x = Math.Max(0, Math.Min(snapshot.Width - 1, pointer.X));
            int y = Math.Max(0, Math.Min(snapshot.Height - 1, pointer.Y));
            Color color = snapshot.GetPixel(x, y);
            string value = String.Format("#{0:X2}{1:X2}{2:X2}", color.R, color.G, color.B);
            int left = pointer.X + 18;
            int top = pointer.Y + 18;
            if (left + 116 > ClientSize.Width) left = pointer.X - 134;
            if (top + 48 > ClientSize.Height) top = pointer.Y - 66;
            using (Brush panel = new SolidBrush(Color.FromArgb(225, 28, 28, 30)))
            using (Brush swatch = new SolidBrush(color))
            using (Brush text = new SolidBrush(Color.White))
            using (Pen border = new Pen(Color.White, 1))
            {
                e.Graphics.FillRectangle(panel, left, top, 116, 48);
                e.Graphics.FillRectangle(swatch, left + 6, top + 6, 36, 36);
                e.Graphics.DrawRectangle(border, left + 6, top + 6, 36, 36);
                e.Graphics.DrawString(value, Font, text, left + 48, top + 16);
            }
        }

        private void CancelPick()
        {
            try { File.WriteAllText(resultPath, "CANCEL"); } catch { }
            finished = true;
            Close();
        }

        protected override void OnFormClosed(FormClosedEventArgs e)
        {
            if (!finished)
            {
                try { File.WriteAllText(resultPath, "CANCEL"); } catch { }
            }
            snapshot.Dispose();
            base.OnFormClosed(e);
        }
    }
}

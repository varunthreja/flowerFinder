using System;
using System.Runtime.Remoting.Contexts;
using Android.Graphics;
using FlowerFinder.Droid;
using FlowerFinder.IconsSet;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;


[assembly: ExportRenderer(typeof(FontAwesomeLabel), typeof(FontAwesomeLabelRenderer))]
namespace FlowerFinder.Droid
{
    public class FontAwesomeLabelRenderer : LabelRenderer
    {
        //public FontAwesomeLabelRenderer(Context context) : base(Android.App.Application.Context)
        //{

        //}
        protected override void OnElementChanged(ElementChangedEventArgs<Label> e)
        {
            base.OnElementChanged(e);
            if (e.OldElement == null)
            {
                Control.Typeface = Typeface.CreateFromAsset(Forms.Context.Assets,
                    "Fonts/" + FontAwesomeLabel.FontAwesomeName + ".otf");
            }
        }
    }
}

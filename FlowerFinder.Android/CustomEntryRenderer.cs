using System;
using Android.Graphics.Drawables;
using Android.Util;
using FlowerFinder;
using FlowerFinder.Droid;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;

[assembly: ExportRenderer(typeof(CustomEntry), typeof(CustomEntryRenderer))]
namespace FlowerFinder.Droid
{
    public class CustomEntryRenderer: EntryRenderer  
    {  
        protected override void OnElementChanged(ElementChangedEventArgs<Entry> e)  
        {  
            base.OnElementChanged(e);  
            if (e.NewElement != null)  
            {  
                var view = (CustomEntry)Element;  
                if (view.IsCurvedCornersEnabled)  
                {  
                    // creating gradient drawable for the curved background  
                    var _gradientBackground = new GradientDrawable();  
                    _gradientBackground.SetShape(ShapeType.Rectangle);  
                    _gradientBackground.SetColor(view.BackgroundColor.ToAndroid());  
                  
                    // Thickness of the stroke line  
                    _gradientBackground.SetStroke(view.BorderWidth, view.BorderColor.ToAndroid());  
                  
                    // Radius for the curves  
                    _gradientBackground.SetCornerRadius(  
                        DpToPixels(this.Context,Convert.ToSingle(view.CornerRadius)));  
                  
                    // set the background of the   
                    Control.SetBackground(_gradientBackground);  
                }  
                // Set padding for the internal text from border  
                Control.SetPadding(  
                    (int)DpToPixels(this.Context, Convert.ToSingle(12)),Control.PaddingTop,  
                    (int)DpToPixels(this.Context, Convert.ToSingle(12)),Control.PaddingBottom);  
            }  
        }  
        public static float DpToPixels(Android.Content.Context context, float valueInDp)  
        {  
            DisplayMetrics metrics = context.Resources.DisplayMetrics;  
            return TypedValue.ApplyDimension(ComplexUnitType.Dip, valueInDp, metrics);  
        }  
    }  
}

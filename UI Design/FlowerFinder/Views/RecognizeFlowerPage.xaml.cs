using System;
using System.Collections.Generic;

using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class RecognizeFlowerPage : ContentPage
    {
        public RecognizeFlowerPage()
        {
            InitializeComponent();
        }

        void Recognize_Clicked(object sender, System.EventArgs e)
        {
            Navigation.PushAsync(new FlowerDetailsPage());
        }
    }
}

using System;
using System.Collections.Generic;

using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class FlowerDetailsPage : ContentPage
    {
        public FlowerDetailsPage()
        {
            InitializeComponent();
            heartIcon.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() => {
                    heartIcon_clicked();
                })
            });
        }

        async void heartIcon_clicked()
        {
            if(heartIcon.Text == "\uf004")
            {
                heartIcon.Text = "\uf08a";
            }
            else
            {
                heartIcon.Text = "\uf004";
            }

        }
    }
}

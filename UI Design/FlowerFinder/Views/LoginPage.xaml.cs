using System;
using System.Collections.Generic;

using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class LoginPage : ContentPage
    {
        public LoginPage()
        {
            InitializeComponent();

            forgotPasswordBox.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() => {
                    NavigateToForgotPasswordPage();
                })
            });

            continueWithoutLoginBox.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() => {
                    continueWithoutLogin();
                })
            });
        }

        async void NavigateToForgotPasswordPage()
        {
            await Navigation.PushAsync(new ForgotPasswordPage());
        }

        void btnLogin_Clicked(object sender, System.EventArgs e)
        {
            Application.Current.Properties["LoggedIn"] = "test";
            Application.Current.SavePropertiesAsync();
            Navigation.PopAsync(true);
        }

        async void btnSignUp_Clicked(object sender, System.EventArgs e)
        {
            await Navigation.PushAsync(new SignUpPage());
        }

        async void continueWithoutLogin()
        {
            await Navigation.PopAsync(true);
        }

    }
}

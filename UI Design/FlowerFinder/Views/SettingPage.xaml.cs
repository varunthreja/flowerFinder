using System;
using System.Collections.Generic;

using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class SettingPage : ContentPage
    {
        public SettingPage()
        {
            InitializeComponent();
            profileBox.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() => {
                    NavigateToProfilePage();
                })
            });

            changePasswordBox.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() => {
                    NavigateToChangePasswordPage();
                })
            });
        }

        async void NavigateToProfilePage()
        {
            if (Application.Current.Properties.ContainsKey("LoggedIn") && Application.Current.Properties["LoggedIn"].ToString() != "")
            {
                await Navigation.PushAsync(new ProfilePage());
            }
            else
            {
                await Navigation.PushAsync(new LoginPage());
            }

        }

        async void NavigateToChangePasswordPage()
        {
            await Navigation.PushAsync(new ChangePasswordPage());
        }

        void Logout_Clicked(object sender, EventArgs e)
        {
            Application.Current.Properties["LoggedIn"] = "";
            Application.Current.SavePropertiesAsync();
            //DisplayAlert("Confirmation","Are you sure you want to logout!", "OK");
        }
    }
}

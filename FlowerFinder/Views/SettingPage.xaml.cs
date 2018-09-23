using System;
using System.Collections.Generic;
using Plugin.Connectivity;
using Rg.Plugins.Popup.Extensions;
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
                Command = new Command(() =>
                {
                    NavigateToProfilePage();
                })
            });

            changePasswordBox.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() =>
                {
                    NavigateToChangePasswordPage();
                })
            });
        }

        protected override void OnAppearing() // Method called everytime when page appear 
        {
            base.OnAppearing();
            if (Application.Current.Properties.ContainsKey("userId") && Application.Current.Properties["userId"].ToString() != "")
            {
                changePasswordBox.IsVisible = true;
                userName.Text = Application.Current.Properties["userName"].ToString();
                if (Application.Current.Properties.ContainsKey("profileImageURL") && Application.Current.Properties["profileImageURL"].ToString() != "")
                {
                    profileImage.Source = Constants.IMAGE_BASE_URL + Application.Current.Properties["profileImageURL"].ToString();
                }
                else
                {
                    profileImage.Source = "ProfileImage.png";
                }
            }
            else
            {
                changePasswordBox.IsVisible = false;
            }
        }

        async void NavigateToProfilePage()
        {
            if (Application.Current.Properties.ContainsKey("userId") && Application.Current.Properties["userId"].ToString() != "")
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

        async void Logout_Clicked(object sender, EventArgs e)
        {
            if (Application.Current.Properties.ContainsKey("userId") && Application.Current.Properties["userId"].ToString() != "")
            {
                var answer = await DisplayAlert(Messages.CONFIRMATION, "Do you wan't to Log Out from the App?", "Yes", "No");
                if (answer)
                {
                    //Creating the object of validation class
                    FormValidations login = new FormValidations();

                    //network check for the device
                    if (CrossConnectivity.Current.IsConnected)
                    {
                        await Navigation.PushPopupAsync(new LoadingIndicator());// showing loader
                        //Creating the object of Web services class
                        WebServiceClient apiClient = new WebServiceClient();
                        HelperClass helperClass = new HelperClass();
                        var logOutApi = await apiClient.logOut(helperClass.GetCookie());

                        if (logOutApi.status == "success")
                        {
                            changePasswordBox.IsVisible = false;
                            userName.Text = "Profile";
                            profileImage.Source = "ProfileImage.png";
                            Application.Current.Properties["userId"] = "";
                            Application.Current.Properties["userName"] = "";
                            Application.Current.Properties["email"] = "";
                            Application.Current.Properties["firstName"] = "";
                            Application.Current.Properties["lastName"] = "";
                            Application.Current.Properties["provider"] = "";
                            Application.Current.Properties["profileImageURL"] = "";
                            Application.Current.Properties["sessionId"] = "";
                            await Application.Current.SavePropertiesAsync();
                            await DisplayAlert(Messages.CONFIRMATION, logOutApi.message, Messages.ALERT_BOX_BUTTON);
                            await Navigation.PopPopupAsync(true); //closing loader
                        }
                        else
                        {
                            await Navigation.PopPopupAsync(true);
                            await DisplayAlert(Messages.ALERT, Messages.UNIVERSAL_ERROR_MESSAGE, Messages.ALERT_BOX_BUTTON);
                        }
                    }
                    else
                    {
                        await DisplayAlert(Messages.NETWORK_ERROR_MSG_TITLE, Messages.NO_INTERNET_NETWORK, Messages.ALERT_BOX_BUTTON);
                    }
                }
            }


        }
    }
}

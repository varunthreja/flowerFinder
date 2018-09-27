using System;
using System.Collections.Generic;
using Plugin.Connectivity;
using Plugin.SecureStorage;
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
            if (CrossSecureStorage.Current.HasKey("userId") && CrossSecureStorage.Current.GetValue("userId").ToString() != "")
            {
                changePasswordBox.IsVisible = true;
                userName.Text = CrossSecureStorage.Current.GetValue("userName");
                if (CrossSecureStorage.Current.HasKey("profileImageURL") && CrossSecureStorage.Current.GetValue("profileImageURL").ToString() != "")
                {
                    profileImage.Source = Constants.IMAGE_BASE_URL + CrossSecureStorage.Current.GetValue("profileImageURL");
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
            if (CrossSecureStorage.Current.HasKey("userId") && CrossSecureStorage.Current.GetValue("userId").ToString() != "")
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
            if (CrossSecureStorage.Current.HasKey("userId") && CrossSecureStorage.Current.GetValue("userId").ToString() != "")
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

                            CrossSecureStorage.Current.DeleteKey("userId");
                            CrossSecureStorage.Current.DeleteKey("userName");
                            CrossSecureStorage.Current.DeleteKey("email");
                            CrossSecureStorage.Current.DeleteKey("firstName");
                            CrossSecureStorage.Current.DeleteKey("lastName");
                            CrossSecureStorage.Current.DeleteKey("provider");
                            CrossSecureStorage.Current.DeleteKey("profileImageURL");
                            CrossSecureStorage.Current.DeleteKey("sessionId");

                            await Navigation.PopPopupAsync(true);//closing loader
                            await DisplayAlert(Messages.CONFIRMATION, logOutApi.message, Messages.ALERT_BOX_BUTTON);
                             
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

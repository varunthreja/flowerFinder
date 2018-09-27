using System;
using System.Collections.Generic;
using Plugin.Connectivity;
using Plugin.SecureStorage;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class LoginPage : ContentPage
    {
        Dictionary<string, string> loginValidationResult;

        public LoginPage()
        {
            InitializeComponent();

            forgotPasswordBox.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() =>
                {
                    NavigateToForgotPasswordPage();
                })
            });

            continueWithoutLoginBox.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() =>
                {
                    continueWithoutLogin();
                })
            });
        }

        async void NavigateToForgotPasswordPage()
        {
            await Navigation.PushAsync(new ForgotPasswordPage());
        }

        async void btnLogin_Clicked(object sender, System.EventArgs e)
        {
            var emailID = email.Text;
            var psw = password.Text;

            //Creating the object of validation class
            FormValidations login = new FormValidations();

            //validate the user inputs
            loginValidationResult = login.LoginValidation(emailID, psw);
            if (loginValidationResult["Result"].ToString() == "Success")
            {
                //network check for the device
                if (CrossConnectivity.Current.IsConnected)
                {
                    await Navigation.PushPopupAsync(new LoadingIndicator());// showing loader
                    //Creating the object of Web services class
                    WebServiceClient apiClient = new WebServiceClient();

                    var userDetails = await apiClient.LogUserIn(emailID, psw);

                    if (userDetails.status == "success")
                    {
                        CrossSecureStorage.Current.SetValue("userId", userDetails.user._id);
                        CrossSecureStorage.Current.SetValue("userName", userDetails.user.displayName);
                        CrossSecureStorage.Current.SetValue("email", userDetails.user.email);
                        CrossSecureStorage.Current.SetValue("firstName", userDetails.user.firstName);
                        CrossSecureStorage.Current.SetValue("lastName", userDetails.user.lastName);
                        CrossSecureStorage.Current.SetValue("provider", userDetails.user.provider);
                        CrossSecureStorage.Current.SetValue("profileImageURL", userDetails.user.profileImageURL);

                        await Navigation.PopPopupAsync(true); //closing loader
                        await Navigation.PopAsync(true);
                    }
                    else
                    {
                        await Navigation.PopPopupAsync(true);
                        await DisplayAlert(Messages.LOGIN_ERROR_MSG_TITLE, Messages.VALID_CREDENTIALS_MESSAGE, Messages.ALERT_BOX_BUTTON);
                    }
                }
                else
                {
                    await DisplayAlert(Messages.NETWORK_ERROR_MSG_TITLE, Messages.NO_INTERNET_NETWORK, Messages.ALERT_BOX_BUTTON);
                }
            }
            else
            {
                await DisplayAlert(Messages.LOGIN_ERROR_MSG_TITLE, loginValidationResult["Message"], Messages.ALERT_BOX_BUTTON);
            }
        }

        async void btnSignUp_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new SignUpPage());
        }

        async void continueWithoutLogin()
        {
            await Navigation.PopAsync(true);
        }

    }
}

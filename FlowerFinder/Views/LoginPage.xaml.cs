using System;
using System.Collections.Generic;
using Plugin.Connectivity;
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
                        Application.Current.Properties["userId"] = userDetails.user._id;
                        Application.Current.Properties["userName"] = userDetails.user.displayName;
                        Application.Current.Properties["email"] = userDetails.user.email;
                        Application.Current.Properties["firstName"] = userDetails.user.firstName;
                        Application.Current.Properties["lastName"] = userDetails.user.lastName;
                        Application.Current.Properties["provider"] = userDetails.user.provider;
                        Application.Current.Properties["profileImageURL"] = userDetails.user.profileImageURL;
                        await Application.Current.SavePropertiesAsync();

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

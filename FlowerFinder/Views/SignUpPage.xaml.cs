﻿using System;
using System.Collections.Generic;
using Plugin.Connectivity;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class SignUpPage : ContentPage
    {
        Dictionary<string, string> signupValidationResult;
        public SignUpPage()
        {
            InitializeComponent();
        }

        async void btnSubmit_Clicked(object sender, EventArgs e)
        {
            var fname = firstName.Text;
            var lname = lastName.Text;
            var emailId = email.Text;
            var psw = password.Text;
            var cpsw = confirmPassword.Text;

            //Creating the object of validation class
            FormValidations login = new FormValidations();
            //validate the user inputs
            signupValidationResult = login.signUpValidation(fname, lname, emailId, psw, cpsw);
            if (signupValidationResult["Result"].ToString() == "Success")
            {
                //network check for the device
                if (CrossConnectivity.Current.IsConnected)
                {
                    await Navigation.PushPopupAsync(new LoadingIndicator());// showing loader
                    //Creating the object of Web services class
                    WebServiceClient apiClient = new WebServiceClient();
                    HelperClass helperClass = new HelperClass();
                    var userDetails = await apiClient.SignUpUser(fname, lname, emailId, psw, "local", helperClass.GetCookie());
                    if (userDetails.status == "success")
                    {
                        Application.Current.Properties["userId"] = userDetails.user._id;
                        Application.Current.Properties["userName"] = userDetails.user.displayName;
                        Application.Current.Properties["email"] = userDetails.user.email;
                        Application.Current.Properties["firstName"] = userDetails.user.firstName;
                        Application.Current.Properties["lastName"] = userDetails.user.lastName;
                        Application.Current.Properties["provider"] = userDetails.user.provider;
                        await Application.Current.SavePropertiesAsync();

                        await Navigation.PopPopupAsync(true); // closing loader
                        PopUntilDestination(typeof(SettingPage));
                    }
                    else
                    {
                        await Navigation.PopPopupAsync(true);
                        await DisplayAlert(Messages.LOGIN_ERROR_MSG_TITLE, Messages.USERALREADYEXIT_MESSAGE, Messages.ALERT_BOX_BUTTON);
                    }
                }
                else
                {
                    await DisplayAlert(Messages.NETWORK_ERROR_MSG_TITLE, Messages.NO_INTERNET_NETWORK, Messages.ALERT_BOX_BUTTON);
                }

            }
            else
            {
                await DisplayAlert(Messages.LOGIN_ERROR_MSG_TITLE, signupValidationResult["Message"], Messages.ALERT_BOX_BUTTON);
            }
        }

        void PopUntilDestination(Type DestinationPage)
        {
            int LeastFoundIndex = 0;
            int PagesToRemove = 0;

            for (int index = Navigation.NavigationStack.Count - 2; index > 0; index--)
            {
                if (Navigation.NavigationStack[index].GetType().Equals(DestinationPage))
                {
                    break;
                }
                else
                {
                    LeastFoundIndex = index;
                    PagesToRemove++;
                }
            }

            for (int index = 0; index < PagesToRemove; index++)
            {
                Navigation.RemovePage(Navigation.NavigationStack[LeastFoundIndex]);
            }

            Navigation.PopAsync();
        }
    }
}
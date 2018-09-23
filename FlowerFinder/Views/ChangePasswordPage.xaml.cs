using System;
using System.Collections.Generic;
using System.Json;
using Newtonsoft.Json;
using Plugin.Connectivity;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class ChangePasswordPage : ContentPage
    {
        Dictionary<string, string> changePasswordValidationResult;
        public ChangePasswordPage()
        {
            InitializeComponent();
        }

        async void btnSubmit_Clicked(object sender, System.EventArgs e)
        {
            var oldpsw = oldPassword.Text;
            var newpsw = newPassword.Text;
            var cnewpsw = confirmNewPassword.Text;

            //Creating the object of validation class
            FormValidations login = new FormValidations();

            //validate the user inputs
            changePasswordValidationResult = login.changePasswordValidation(newpsw, cnewpsw);
            if (changePasswordValidationResult["Result"].ToString() == "Success")
            {
                //network check for the device
                if (CrossConnectivity.Current.IsConnected)
                {
                    await Navigation.PushPopupAsync(new LoadingIndicator());// showing loader
                    //Creating the object of Web services class
                    WebServiceClient apiClient = new WebServiceClient();
                    HelperClass helperClass = new HelperClass();

                    string passwordChangeStatus = await apiClient.ChangePassword(oldpsw, newpsw, cnewpsw, helperClass.GetCookie());
                    var messageString = JsonConvert.DeserializeObject<JsonObject>(passwordChangeStatus);
                    var message = "";
                    foreach (var c in messageString)
                    {
                        message = c.Value.ToString();
                    }

                    if (!string.IsNullOrEmpty(passwordChangeStatus) && message.Trim('"') != "Current password is incorrect")
                    {
                        await DisplayAlert(Messages.CONFIRMATION, message.Trim('"'), Messages.ALERT_BOX_BUTTON);

                        await Navigation.PopPopupAsync(true); // closing loader
                        await Navigation.PopAsync(true);
                    }
                    else
                    {
                        await Navigation.PopPopupAsync(true);
                        await DisplayAlert(Messages.ALERT, message.Trim('"'), Messages.ALERT_BOX_BUTTON);
                    }
                }
                else
                {
                    await DisplayAlert(Messages.NETWORK_ERROR_MSG_TITLE, Messages.NO_INTERNET_NETWORK, Messages.ALERT_BOX_BUTTON);
                }

            }
            else
            {
                await DisplayAlert(Messages.LOGIN_ERROR_MSG_TITLE, changePasswordValidationResult["Message"], Messages.ALERT_BOX_BUTTON);
            }
        }
    }
}

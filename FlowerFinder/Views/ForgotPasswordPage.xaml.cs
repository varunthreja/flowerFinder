using System;
using System.Collections.Generic;
using System.Json;
using Newtonsoft.Json;
using Plugin.Connectivity;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class ForgotPasswordPage : ContentPage
    {
        Dictionary<string, string> forgotValidationResult;
        public ForgotPasswordPage()
        {
            InitializeComponent();
        }

        async void btnSend_Clicked(object sender, System.EventArgs e)
        {
            var emailId = email.Text;
            //Creating the object of validation class
            FormValidations login = new FormValidations();

            //validate the user inputs
            forgotValidationResult = login.forgotPasswordValidation(emailId);
            if (forgotValidationResult["Result"].ToString() == "Success")
            {
                //network check for the device
                if (CrossConnectivity.Current.IsConnected)
                {
                    await Navigation.PushPopupAsync(new LoadingIndicator());// showing loader
                    //Creating the object of Web services class
                    WebServiceClient apiClient = new WebServiceClient();
                    HelperClass helperClass = new HelperClass();
                    var emailStatus = await apiClient.ForgotPassword(helperClass.GetCookie(), emailId);
                    var messageString = JsonConvert.DeserializeObject<JsonObject>(emailStatus);
                    var message = "";
                    foreach (var c in messageString)
                    {
                        message = c.Value.ToString();
                    }

                    if (!string.IsNullOrEmpty(emailStatus) && message.Trim('"') != "No account with that email has been found")
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
                await DisplayAlert(Messages.ALERT, forgotValidationResult["Message"], Messages.ALERT_BOX_BUTTON);
            }
        }
    }
}

using System;
using System.Collections.Generic;
using Plugin.Connectivity;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class FlowerDetailsPage : ContentPage
    {
        //RecognizedFlowerDetailsModel flowerDetails;
        string sourcePageName;
        string plantID;
        string recognizeId;

        public FlowerDetailsPage()
        {
            InitializeComponent();
        }

        public FlowerDetailsPage(RecognizedFlowerDetailsModel recognizedFlowerDetails, string sourcePage)
        { 
            InitializeComponent();


            //flowerDetails = recognizedFlowerDetails;
            sourcePageName = sourcePage;
            //flowerDetails.recognition.plantId.

            heartIcon.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() => {
                    heartIcon_clicked();
                })
            });

            if ((recognizedFlowerDetails != null && recognizedFlowerDetails.status.ToString() == "success") && (recognizedFlowerDetails.recognition != null && recognizedFlowerDetails.recognition.plantId != null))
            {
                plantID = recognizedFlowerDetails.recognition.plantId._id;
                recognizeId = recognizedFlowerDetails.recognition._id;

                if(recognizedFlowerDetails.recognition.plantId.isFavourite)
                {
                    heartIcon.Text = "\uf004";
                }
                else
                {
                    heartIcon.Text = "\uf08a";
                }

                flowerScientificName.Text= "Scientific Name : " + recognizedFlowerDetails.recognition.plantId.scientificName;
                description.Text = recognizedFlowerDetails.recognition.plantId.description;
                careTips.Text = recognizedFlowerDetails.recognition.plantId.careTips;

                if (!string.IsNullOrEmpty(recognizedFlowerDetails.recognition.plantId.commonName))
                {
                    Title = recognizedFlowerDetails.recognition.plantId.commonName;
                }
                else
                {
                    Title = recognizedFlowerDetails.recognition.plantId.scientificName;
                }

                if (!string.IsNullOrEmpty(recognizedFlowerDetails.recognition.recognitionImageURL))
                {
                    recongnizedFlowerImageContainer.IsVisible = true;
                    flowerImageContainer.IsVisible = false;
                    flowerImageSent.Source = Constants.IMAGE_BASE_URL+ recognizedFlowerDetails.recognition.recognitionImageURL;
                    orignalFlowerImage.Source = Constants.IMAGE_BASE_URL + recognizedFlowerDetails.recognition.plantId.pictures[0].ToString();
                }
                else
                {
                    recongnizedFlowerImageContainer.IsVisible = false;
                    flowerImageContainer.IsVisible = true;

                    if(recognizedFlowerDetails.recognition.plantId.pictures.Count!=0 && recognizedFlowerDetails.recognition.plantId.pictures[0]!=null)
                    {
                        flowerImage.Source=Constants.IMAGE_BASE_URL + recognizedFlowerDetails.recognition.plantId.pictures[0].ToString();
                    }
                    else
                    {
                        flowerImage.Source = "DefaultFlowerImage.png";
                    }
                }

            }
            else
            {
                Title = "Recognize Result";
                recognizeId = recognizedFlowerDetails.recognition._id;
                if (!string.IsNullOrEmpty(recognizedFlowerDetails.recognition.status))
                {
                    flowerScientificName.Text = recognizedFlowerDetails.recognition.status; 
                }
                else
                {
                    flowerScientificName.Text = "No Details Found"; 
                }
                detailsContainer.IsVisible = false;
                heartIcon.IsVisible = false;
            }


        }

        //protected override async void OnAppearing() // Method called everytime when page appear 
        //{
        //    base.OnAppearing();
        //    //await DisplayAlert(Messages.NETWORK_ERROR_MSG_TITLE, Messages.NO_INTERNET_NETWORK, Messages.ALERT_BOX_BUTTON);
        //}

        async void heartIcon_clicked()
        {
            if (Application.Current.Properties.ContainsKey("userId") && Application.Current.Properties["userId"].ToString() != "")
            {
                WebServiceClient apiClient = new WebServiceClient();
                HelperClass helperClass = new HelperClass();
                await Navigation.PushPopupAsync(new LoadingIndicator());// showing loader
                if (heartIcon.Text == "\uf004")
                {
                    var favFlowerResult = await apiClient.markFavourite(helperClass.GetCookie(), plantID, false);
                    if(favFlowerResult.status.ToString()=="success")
                    {
                        heartIcon.Text = "\uf08a";// heart icon
                    }
                    await Navigation.PopPopupAsync(true); 
                }
                else
                {
                    var favFlowerResult = await apiClient.markFavourite(helperClass.GetCookie(), plantID, true);
                    if (favFlowerResult.status.ToString() == "success")
                    {
                        heartIcon.Text = "\uf004";// filled heart icon
                    }
                    await Navigation.PopPopupAsync(true); 
                }
            }
            else
            {
                var answer = await Xamarin.Forms.Application.Current.MainPage.DisplayAlert(Messages.ALERT, "In order to add this to your favorites, you have to login.", "Login", "Cancel");
                if (answer)
                {
                    await Navigation.PushAsync(new LoginPage());
                }
            }
        }

        async void btnHR_Clicked(object sender, EventArgs e)
        {
            if (Application.Current.Properties.ContainsKey("userId") && Application.Current.Properties["userId"].ToString() != "")
            {
                if (CrossConnectivity.Current.IsConnected)
                {
                    await Navigation.PushPopupAsync(new LoadingIndicator());// showing loader
                    //Creating the object of Web services class
                    WebServiceClient apiClient = new WebServiceClient();
                    HelperClass helperClass = new HelperClass();
                    var recognizeRequest = await apiClient.HumanRecognizationRequest(helperClass.GetCookie(), recognizeId);
                    if(recognizeRequest.status.ToString()=="success")
                    {
                        await DisplayAlert(Messages.CONFIRMATION, recognizeRequest.message, Messages.ALERT_BOX_BUTTON);
                        await Navigation.PopPopupAsync(true);
                    }
                    else
                    {
                        await Navigation.PopPopupAsync(true);
                    }
                }
                else
                {
                    await DisplayAlert(Messages.NETWORK_ERROR_MSG_TITLE, Messages.NO_INTERNET_NETWORK, Messages.ALERT_BOX_BUTTON);
                }
            }
            else
            {
                var answer = await Xamarin.Forms.Application.Current.MainPage.DisplayAlert(Messages.ALERT, "In order to send request for human recognition, you have to Login.", "Login", "Cancel");
                if (answer)
                {
                    await Navigation.PushAsync(new LoginPage());
                }
            }
        }
    }
}

using System;
using System.Collections.Generic;
using Plugin.Connectivity;
using Plugin.Media;
using Plugin.Media.Abstractions;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class RecognizeFlowerPage : ContentPage
    {
        MediaFile flowerImage=null;

        public RecognizeFlowerPage()
        {
            InitializeComponent();
            pickImageIcon.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() =>
                {
                    pickImage();
                })
            });
            captureImageIcon.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() =>
                {
                    captureImage();
                })
            });
        }

        async void btnRecognize_Clicked(object sender, System.EventArgs e)
        {
            if (CrossConnectivity.Current.IsConnected)
            {
                await Navigation.PushPopupAsync(new LoadingIndicator());// showing loader

                //Creating the object of Web services class
                WebServiceClient apiClient = new WebServiceClient();
                HelperClass helperClass = new HelperClass();
                var flowerDetails = await apiClient.RecognizeFlower(flowerImage, helperClass.GetCookie());
                if (flowerDetails!=null)
                {
                    if(flowerDetails.recognition!=null)
                    {
                        await Navigation.PushAsync(new FlowerDetailsPage(flowerDetails, "Recognize"));
                        await Navigation.PopPopupAsync(true); 
                    }
                }
                else
                {
                    await DisplayAlert(Messages.ALERT, Messages.UNIVERSAL_ERROR_MESSAGE, Messages.ALERT_BOX_BUTTON);
                }
            }
            else
            {
                await DisplayAlert(Messages.NETWORK_ERROR_MSG_TITLE, Messages.NO_INTERNET_NETWORK, Messages.ALERT_BOX_BUTTON);
            }
        }

        void btnNewPicture_Clicked(object sender, System.EventArgs e)
        {
            ShowImageContainer.IsVisible = false;
            CaptureOrChooseOptionsContainer.IsVisible = true;
        }

        async void pickImage()
        {
            await CrossMedia.Current.Initialize();

            if (!CrossMedia.Current.IsPickPhotoSupported)
            {
                await DisplayAlert("No Supported", "This device does not currently support this functionality.", "OK");
                return;
            }

            var mediaOptions = new PickMediaOptions()
            {
                PhotoSize = PhotoSize.Custom,
                CustomPhotoSize = 25,
                CompressionQuality = 50
            };

            //await Application.Current.MainPage.Navigation.PushPopupAsync(new LoadingIndicator());
            flowerImage = await CrossMedia.Current.PickPhotoAsync(mediaOptions);

            if (flowerImage == null)
            {
                await DisplayAlert("Error", "Could not get the image, Please try again.", "OK");
                image.Source = null;
                //await Application.Current.MainPage.Navigation.PopPopupAsync(true);
                return;
            }
            else
            {
                image.Source = ImageSource.FromStream(() =>
                {
                    var streamImg = flowerImage.GetStream();
                    return streamImg;
                });

                //recognizeImage(flowerImage);
                ShowImageContainer.IsVisible = true;
                CaptureOrChooseOptionsContainer.IsVisible = false;

            }

            //await Application.Current.MainPage.Navigation.PopPopupAsync(true);
        }

        async void captureImage()
        {
            await CrossMedia.Current.Initialize();

            if (!CrossMedia.Current.IsCameraAvailable || !CrossMedia.Current.IsTakePhotoSupported)
            {
                await DisplayAlert("No Camera", ":( No camera available.", "OK");
                return;
            }

            //await Application.Current.MainPage.Navigation.PushPopupAsync(new LoadingIndicator());

            flowerImage = await CrossMedia.Current.TakePhotoAsync(new StoreCameraMediaOptions
            {
                Directory = "Sample",
                Name = "test.jpg",
                PhotoSize = PhotoSize.Custom,
                CustomPhotoSize = 25,
                CompressionQuality = 50
            });

            if (flowerImage == null)
            {
                //await Application.Current.MainPage.Navigation.PopPopupAsync(true);
                return;
            }
            else
            {
                //this block of code can be use to get captured image 
                image.Source = ImageSource.FromStream(() =>
                {
                    var streamImg = flowerImage.GetStream();
                    return streamImg;
                });

                //var stream = capturedImage.GetStream();
                //var bytes = new byte[stream.Length];
                //await stream.ReadAsync(bytes, 0, (int)stream.Length);
                //string base64 = System.Convert.ToBase64String(bytes);
                //Console.WriteLine(base64);

                //recognizeImage(flowerImage);
                ShowImageContainer.IsVisible = true;
                CaptureOrChooseOptionsContainer.IsVisible = false;

            }
            //await Application.Current.MainPage.Navigation.PopPopupAsync(true);
        }

        //async void recognizeImage(MediaFile image)
        //{

        //    //network check for the device

        //}
    }


}

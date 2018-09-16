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
        public RecognizeFlowerPage()
        {
            InitializeComponent();
            pickImageIcon.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() => {
                    pickImage();
                })
            });
            captureImageIcon.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() => {
                    captureImage();
                })
            });
        }

        void btnRecognize_Clicked(object sender, System.EventArgs e)
        {
            Navigation.PushAsync(new FlowerDetailsPage());

            //if (CrossConnectivity.Current.IsConnected)
            //{
            //    Console.WriteLine("Submitting the request");
            //    WebService webService = new WebService();
            //    await webService.postPatientDetails(spineModel);
            //}
            //else
            //{
            //    await DisplayAlert("Alert", "No internet connectivity. Please try again later.", "OK");
            //}
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
                PhotoSize=PhotoSize.Medium
            };

            await Application.Current.MainPage.Navigation.PushPopupAsync(new LoadingIndicator());
            var selectedImage = await CrossMedia.Current.PickPhotoAsync(mediaOptions);

            if(selectedImage==null)
            {
                await DisplayAlert("Error", "Could not get the image, Please try again.", "OK");
                image.Source = null;
                await Application.Current.MainPage.Navigation.PopPopupAsync(true);
                return;
            }
            else
            {
                image.Source = ImageSource.FromStream(() =>
                {
                    var streamImg = selectedImage.GetStream();
                    return streamImg;
                });

                ShowImageContainer.IsVisible = true;
                CaptureOrChooseOptionsContainer.IsVisible = false;
                
            }
            await Application.Current.MainPage.Navigation.PopPopupAsync(true);
        }

        async void captureImage()
        {
            await CrossMedia.Current.Initialize();

            if (!CrossMedia.Current.IsCameraAvailable || !CrossMedia.Current.IsTakePhotoSupported)
            {
                await DisplayAlert("No Camera", ":( No camera available.", "OK");
                return;
            }

            await Application.Current.MainPage.Navigation.PushPopupAsync(new LoadingIndicator());

            var capturedImage = await CrossMedia.Current.TakePhotoAsync(new StoreCameraMediaOptions
            {
                Directory = "Sample",
                Name = "test.jpg"
            });

            if (capturedImage == null)
            {
                await Application.Current.MainPage.Navigation.PopPopupAsync(true);
                return;
            }
            else
            {
                //this block of code can be use to get captured image 
                image.Source = ImageSource.FromStream(() =>
                {
                    var streamImg = capturedImage.GetStream();
                    return streamImg;
                });

                var stream = capturedImage.GetStream();
                var bytes = new byte[stream.Length];
                await stream.ReadAsync(bytes, 0, (int)stream.Length);
                string base64 = System.Convert.ToBase64String(bytes);
                //Console.WriteLine(base64);

                ShowImageContainer.IsVisible = true;
                CaptureOrChooseOptionsContainer.IsVisible = false;

            }
            await Application.Current.MainPage.Navigation.PopPopupAsync(true);
        }

    }
}

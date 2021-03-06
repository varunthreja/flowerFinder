﻿using System;
using System.Collections.Generic;
using Plugin.Connectivity;
using Plugin.Media;
using Plugin.Media.Abstractions;
using Plugin.SecureStorage;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class ProfilePage : ContentPage
    {
        Dictionary<string, string> profileValidationResult;
        public ProfilePage()
        {
            InitializeComponent();

            profileImage.GestureRecognizers.Add(
            new TapGestureRecognizer()
            {
                Command = new Command(() =>
                {
                    ChangeProfileImage();
                })
            });

            if (CrossSecureStorage.Current.HasKey("userId") && CrossSecureStorage.Current.GetValue("userId").ToString() != "")
            {
                firstName.Text = CrossSecureStorage.Current.GetValue("firstName");
                lastName.Text = CrossSecureStorage.Current.GetValue("lastName");
                email.Text = CrossSecureStorage.Current.GetValue("email");
                if (CrossSecureStorage.Current.HasKey("phoneNo") && CrossSecureStorage.Current.GetValue("phoneNo").ToString() != "")
                {
                    phoneNumber.Text = CrossSecureStorage.Current.GetValue("phoneNo");
                }
                if (CrossSecureStorage.Current.HasKey("profileImageURL") && CrossSecureStorage.Current.GetValue("profileImageURL").ToString() != "")
                {
                    profileImage.Source = Constants.IMAGE_BASE_URL + CrossSecureStorage.Current.GetValue("profileImageURL");
                }
                else
                {
                    profileImage.Source = "ProfileImage.png";
                }
            }
        }

        async void ChangeProfileImage()
        {
            var action = await DisplayActionSheet("Change Profile image", "Cancel", null, "Choose from library", "Take a picture");
            switch (action)
            {
                case "Choose from library":
                    pickImage();
                    break;
                case "Take a picture":
                    captureImage();
                    break;
                default:
                    break;
            }
        }

        protected override void OnAppearing() // Method called everytime when page appear 
        {
            base.OnAppearing();
            if (CrossSecureStorage.Current.HasKey("userId") && CrossSecureStorage.Current.GetValue("userId").ToString() != "")
            {
                firstName.Text = CrossSecureStorage.Current.GetValue("firstName");
                lastName.Text = CrossSecureStorage.Current.GetValue("lastName");
                email.Text = CrossSecureStorage.Current.GetValue("email");
                if (CrossSecureStorage.Current.HasKey("phoneNo") && CrossSecureStorage.Current.GetValue("phoneNo").ToString() != "")
                {
                    phoneNumber.Text = CrossSecureStorage.Current.GetValue("phoneNo");
                }
                if (CrossSecureStorage.Current.HasKey("profileImageURL") && CrossSecureStorage.Current.GetValue("profileImageURL").ToString() != "")
                {
                    profileImage.Source = Constants.IMAGE_BASE_URL + CrossSecureStorage.Current.GetValue("profileImageURL");
                }
                else
                {
                    profileImage.Source = "ProfileImage.png";
                }
            }
        }

        async void pickImage()
        {
            if (!CrossMedia.Current.IsPickPhotoSupported)
            {
                await DisplayAlert("No Supported", "This device does not currently support this functionality.", "OK");
                return;
            }

            var mediaOptions = new PickMediaOptions()
            {
                PhotoSize = PhotoSize.Custom,
                CustomPhotoSize=25,
                CompressionQuality=50
            };

            //await Application.Current.MainPage.Navigation.PushPopupAsync(new LoadingIndicator());
            var selectedImage = await CrossMedia.Current.PickPhotoAsync(mediaOptions);

            if (selectedImage == null)
            {
                await DisplayAlert("Error", "Could not get the image, Please try again.", "OK");
                //await Application.Current.MainPage.Navigation.PopPopupAsync(true);
                return;
            }
            else
            {
                //profileImage.Source = ImageSource.FromStream(() =>
                //{
                //    var streamImg = selectedImage.GetStream();
                //    return streamImg;
                //});

                //var stream = selectedImage.GetStream();
                //var bytes = new byte[stream.Length];
                //await stream.ReadAsync(bytes, 0, (int)stream.Length);
                //string base64 = System.Convert.ToBase64String(bytes);
                changeProfileImage(selectedImage);
            }
        }

        async void captureImage()
        {
            await CrossMedia.Current.Initialize();

            if (!CrossMedia.Current.IsCameraAvailable || !CrossMedia.Current.IsTakePhotoSupported)
            {
                await DisplayAlert("No Camera", ":( No camera available.", "OK");
                return;
            }

            var capturedImage = await CrossMedia.Current.TakePhotoAsync(new StoreCameraMediaOptions
            {
                Directory = "Sample",
                Name = "test.jpg",
                PhotoSize = PhotoSize.Custom,
                CustomPhotoSize=25,
                CompressionQuality=50
            });

            if (capturedImage == null)
            {
                //await Application.Current.MainPage.Navigation.PopPopupAsync(true);
                return;
            }
            else
            {
                //this block of code can be use to get captured image 
                //profileImage.Source = ImageSource.FromStream(() =>
                //{
                //    var streamImg = capturedImage.GetStream();
                //    return streamImg;
                //});

                //var stream = capturedImage.GetStream();
                //var bytes = new byte[stream.Length];
                //await stream.ReadAsync(bytes, 0, (int)stream.Length);
                //string base64 = System.Convert.ToBase64String(bytes);
                //Console.WriteLine(base64);
                changeProfileImage(capturedImage);
            }

        }

        async void changeProfileImage(MediaFile profilePicture)
        {
            //Console.WriteLine(profilePicture);
            var answer = await DisplayAlert(Messages.CONFIRMATION, "Are you sure, you want to change profile picture?", "Yes", "No");
            if (answer)
            {
                //network check for the device
                if (CrossConnectivity.Current.IsConnected)
                {
                    await Navigation.PushPopupAsync(new LoadingIndicator());// showing loader
                                                                            //Creating the object of Web services class
                    WebServiceClient apiClient = new WebServiceClient();
                    HelperClass helperClass = new HelperClass();
                    var profileImg = await apiClient.UpdateProfileImage(profilePicture, helperClass.GetCookie());
                    if(profileImg!=null && profileImg.status.ToString() == "success")
                    {
                       // profileImg.
                        CrossSecureStorage.Current.SetValue("profileImageURL", profileImg.user.profileImageURL) ;
                        profileImage.Source = Constants.IMAGE_BASE_URL + CrossSecureStorage.Current.GetValue("profileImageURL");
                        await Application.Current.SavePropertiesAsync();
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
        }

        async void btnUpdate_Clicked(object sender, System.EventArgs e)
        {
            var fname = firstName.Text;
            var lname = lastName.Text;
            var emailId = email.Text;
            var phoneNo = phoneNumber.Text;

            if(string.IsNullOrEmpty(phoneNo))
            {
                phoneNo = ""; 
            }

            //Creating the object of validation class
            FormValidations login = new FormValidations();
            //validate the user inputs
            profileValidationResult = login.updateProfileValidation(fname, lname, phoneNo);
            if (profileValidationResult["Result"].ToString() == "Success")
            {
                //network check for the device
                if (CrossConnectivity.Current.IsConnected)
                {
                    await Navigation.PushPopupAsync(new LoadingIndicator());// showing loader
                    //Creating the object of Web services class
                    WebServiceClient apiClient = new WebServiceClient();
                    HelperClass helperClass = new HelperClass();
                    var userProfileDetails = await apiClient.UpdateProfile(fname, lname, phoneNo, helperClass.GetCookie());
                    if (userProfileDetails != null && userProfileDetails.status == "success")
                    {
                        CrossSecureStorage.Current.SetValue("userName", userProfileDetails.user.displayName);
                        CrossSecureStorage.Current.SetValue("email", userProfileDetails.user.email);
                        CrossSecureStorage.Current.SetValue("firstName", userProfileDetails.user.firstName);
                        CrossSecureStorage.Current.SetValue("lastName", userProfileDetails.user.lastName);
                        CrossSecureStorage.Current.SetValue("phoneNo", userProfileDetails.user.phoneNumber.ToString());

                        await Navigation.PopPopupAsync(true); // closing loader
                    }
                    else
                    {
                        await Navigation.PopPopupAsync(true);
                        await DisplayAlert(Messages.UPDATE_PROFILE_ERROR_MSG_TITLE, Messages.USERALREADYEXIT_MESSAGE, Messages.ALERT_BOX_BUTTON);
                    }
                }
                else
                {
                    await DisplayAlert(Messages.NETWORK_ERROR_MSG_TITLE, Messages.NO_INTERNET_NETWORK, Messages.ALERT_BOX_BUTTON);
                }

            }
            else
            {
                await DisplayAlert(Messages.LOGIN_ERROR_MSG_TITLE, profileValidationResult["Message"], Messages.ALERT_BOX_BUTTON);
            }
        }
    }
}

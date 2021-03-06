﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Plugin.Connectivity;
using Plugin.SecureStorage;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class RequestListPage : ContentPage
    {
        public RequestListPage()
        {
            InitializeComponent();

        }

        protected override async void OnAppearing() // Method called everytime when page appear 
        {
            base.OnAppearing();
            if (CrossSecureStorage.Current.HasKey("userId") && CrossSecureStorage.Current.GetValue("userId").ToString() != "")
            {
                if (CrossConnectivity.Current.IsConnected)
                {
                    await Navigation.PushPopupAsync(new LoadingIndicator());// showing loader
                    //Creating the object of Web services class
                    WebServiceClient apiClient = new WebServiceClient();
                    HelperClass helperClass = new HelperClass();
                    RequestListModel requestList = await apiClient.RequestList(helperClass.GetCookie(), "0");
                    if (requestList.status.ToString() == "success")
                    {
                        //RequestListModel = requestList;
                        if (requestList.recognitions.Count != 0)
                        {
                            foreach (var item in requestList.recognitions)
                            {
                                if (string.IsNullOrEmpty(item.recognitionImageURL))
                                {
                                    item.recognitionImageURL = "DefaultFlowerImage.png";
                                }
                                else
                                {
                                    item.recognitionImageURL = Constants.IMAGE_BASE_URL + item.recognitionImageURL;
                                }
                                item.isDeleted = !item.isDeleted;

                            }
                            listViewRequests.ItemsSource = requestList.recognitions;
                            listContainer.IsVisible = true;
                            MessageContainer.IsVisible = false;

                            await Navigation.PopPopupAsync(true);
                        }
                        else
                        {
                            listContainer.IsVisible = false;
                            MessageContainer.IsVisible = true;
                            Message.Text = "Empty Request List.";
                            await Navigation.PopPopupAsync(true);
                        }
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
                var answer = await Xamarin.Forms.Application.Current.MainPage.DisplayAlert(Messages.ALERT, "In order to see recognition requests, you have to Login.", "Login", "Cancel");
                if (answer)
                {
                    await Navigation.PushAsync(new LoginPage());
                }
                else
                {
                    listContainer.IsVisible = false;
                    MessageContainer.IsVisible = true;
                    Message.Text = "Please Login to see recognize requests.";
                }
            }
        }

    }
}

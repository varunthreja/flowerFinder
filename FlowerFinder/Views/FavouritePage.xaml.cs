﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Plugin.Connectivity;
using Plugin.SecureStorage;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class FavouritePage : ContentPage
    {
        public FavouritePage()
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
                    var favouriteList = await apiClient.FavouriteList(helperClass.GetCookie(), "0");

                    if (favouriteList.status.ToString() == "success")
                    {
                        if (favouriteList.plants.Count != 0)
                        {


                            foreach (var item in favouriteList.plants)
                            {
                                if (string.IsNullOrEmpty(item.plantId.pictures[0]))
                                {
                                    item.plantId.pictures[0] = "DefaultFlowerImage.png";
                                }
                                else
                                {
                                    item.plantId.pictures[0] = Constants.IMAGE_BASE_URL + item.plantId.pictures[0];
                                }
                                item.isDeleted = !item.isDeleted;

                            }
                            listViewFavourites.ItemsSource = favouriteList.plants;
                            listContainer.IsVisible = true;
                            MessageContainer.IsVisible = false;
                            await Navigation.PopPopupAsync(true);
                        }
                        else
                        {
                            listContainer.IsVisible = false;
                            MessageContainer.IsVisible = true;
                            Message.Text = "Empty Favourite List.";
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
                var answer = await Xamarin.Forms.Application.Current.MainPage.DisplayAlert(Messages.ALERT, "In order to see favorites, you have to Login.", "Login", "Cancel");
                if (answer)
                {
                    await Navigation.PushAsync(new LoginPage());
                }
                else
                {
                    listContainer.IsVisible = false;
                    MessageContainer.IsVisible = true;
                    Message.Text = "Please Login to see Favourite flowers.";
                }
            }
        }
    }
}

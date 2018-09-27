using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Plugin.Connectivity;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class SearchFlowerPage : ContentPage
    {
        int pageNumber; //used for paging functionality

        public SearchFlowerPage()
        {
            InitializeComponent();
        }

        private async void FilterNames() 
        {  
            string filter = searchBar.Text;  
            listViewSearchItems.BeginRefresh(); 
          
            if (!string.IsNullOrWhiteSpace(filter)) 
            {  
                if (CrossConnectivity.Current.IsConnected)
                {
                    await Navigation.PushPopupAsync(new LoadingIndicator());// showing loader
                    pageNumber = 1;
                    //Creating the object of Web services class
                    WebServiceClient apiClient = new WebServiceClient();
                    HelperClass helperClass = new HelperClass();
                    var searchFlowerList = await apiClient.SearchFlower(helperClass.GetCookie(), filter, pageNumber.ToString());

                    if (searchFlowerList.plants.Count != 0)
                    {
                        //RequestListModel = requestList;
                        foreach (var item in searchFlowerList.plants)
                        {
                            if (string.IsNullOrEmpty(item.pictures[0]))
                            {
                                item.pictures[0] = "DefaultFlowerImage.png";
                            }
                            else
                            {
                                item.pictures[0] = Constants.IMAGE_BASE_URL + item.pictures[0];
                            }
                        }
                        listViewSearchItems.ItemsSource = searchFlowerList.plants;
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
                await DisplayAlert(Messages.SEARCH_ERROR, Messages.SEARCH_ALERT_MESSAGE, Messages.ALERT_BOX_BUTTON);
            }  
            listViewSearchItems.EndRefresh();  
        }  

        void OnSearchBarButtonPressed(object sender, EventArgs args) 
        {  
            FilterNames();  
        } 
    }
}

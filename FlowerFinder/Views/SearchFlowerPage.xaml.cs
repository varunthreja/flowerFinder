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

        //public ObservableCollection<FlowerDetailsModel> _FlowerDetailsModel;
        //public ObservableCollection<FlowerDetailsModel> FlowerDetailsModel
        //{
        //    get { return _FlowerDetailsModel; }
        //    set
        //    {
        //        _FlowerDetailsModel = value;
        //        OnPropertyChanged();
        //    }
        //}
        public SearchFlowerPage()
        {
            InitializeComponent();
            //_FlowerDetailsModel = new ObservableCollection<FlowerDetailsModel>
            //{
            //    new FlowerDetailsModel
            //    {
            //        FlowerName="flower1",
            //        Image="https://4.imimg.com/data4/TJ/ND/MY-36181633/fresh-rose-flower-500x500.jpg",
            //        Date="09-08-2018",
            //        Description="test1"
            //    },
            //    new FlowerDetailsModel
            //    {
            //        FlowerName="flower2",
            //        Image="https://images.pexels.com/photos/87840/daisy-pollen-flower-nature-87840.jpeg?auto=compress&cs=tinysrgb&h=350",
            //        Date="09-08-2018",
            //        Description="test2"
            //    }

            //};
            //listViewSearchItems.ItemsSource = _FlowerDetailsModel;
        }

        private async void FilterNames() 
        {  
            string filter = searchBar.Text;  
            listViewSearchItems.BeginRefresh(); 
          
            if (!string.IsNullOrWhiteSpace(filter)) 
            {  
                //listViewSearchItems.ItemsSource = Iitem.PatientListModel;
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

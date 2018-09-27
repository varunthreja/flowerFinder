using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Plugin.SecureStorage;
using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class MainPage : MasterDetailPage
    {
        public ObservableCollection<NavigationMenuItemsModel> _NavigationMenuItemsModel;
        public ObservableCollection<NavigationMenuItemsModel> NavigationMenuItemsModel
        {
            get { return _NavigationMenuItemsModel; }
            set
            {
                _NavigationMenuItemsModel = value;
                OnPropertyChanged();
            }
        }

        public MainPage()
        {
            InitializeComponent();
            _NavigationMenuItemsModel = new ObservableCollection<NavigationMenuItemsModel>
            {
                new NavigationMenuItemsModel
                {
                    Title="Recognize",
                    Icon="\uf1c5",
                    NavigationPage= typeof(RecognizeFlowerPage)
                },
                new NavigationMenuItemsModel
                {
                    Title="RequestList",
                    Icon="\uf03a",
                    NavigationPage= typeof(RequestListPage)
                },
                new NavigationMenuItemsModel
                {
                    Title="Search",
                    Icon="\uf002",
                    NavigationPage= typeof(SearchFlowerPage)
                },
                new NavigationMenuItemsModel
                {
                    Title="Favourite",
                    Icon="\uf08a",
                    NavigationPage= typeof(FavouritePage)
                },
                new NavigationMenuItemsModel
                {
                    Title="Setting",
                    Icon="\uf013",
                    NavigationPage= typeof(SettingPage)
                }
            };
            listViewMenuItems.ItemsSource = _NavigationMenuItemsModel;
            Detail = new NavigationPage((Page)Activator.CreateInstance(typeof(RecognizeFlowerPage)));
        }

        protected override void OnAppearing() // Method called everytime when page appear 
        {
            base.OnAppearing();

            if (CrossSecureStorage.Current.HasKey("userId") && CrossSecureStorage.Current.GetValue("userId").ToString() != "")
            {
                if (CrossSecureStorage.Current.HasKey("profileImageURL") && CrossSecureStorage.Current.GetValue("profileImageURL").ToString() != "")
                {
                    profileImage.Source = Constants.IMAGE_BASE_URL + CrossSecureStorage.Current.GetValue("profileImageURL");
                }
                else
                {
                    profileImage.Source = "ProfileImage.png";
                }
                userName.Text = CrossSecureStorage.Current.GetValue("userName");
            }
            else
            {
                userName.Text = "User Name";
            }
        }

        private void menuItemsListView_ItemSelected(object sender, SelectedItemChangedEventArgs e)
        {
            var item = (NavigationMenuItemsModel)e.SelectedItem;
            Type page = item.NavigationPage;
            Detail = new NavigationPage((Page)Activator.CreateInstance(page));
            IsPresented = false;
        }
    }
}

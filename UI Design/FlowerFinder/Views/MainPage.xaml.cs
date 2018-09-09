using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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

        private void menuItemsListView_ItemSelected(object sender, SelectedItemChangedEventArgs e) {  
            var item = (NavigationMenuItemsModel) e.SelectedItem;  
            Type page = item.NavigationPage;  
            Detail = new NavigationPage((Page) Activator.CreateInstance(page));  
            IsPresented = false;  
        }
    }
}

using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using Xamarin.Forms;

namespace FlowerFinder
{
    public class NavigationMenuItemsViewModel: INotifyPropertyChanged
    {
        public ObservableCollection<NavigationMenuItemsModel> _NavigationMenuItemsModel;

        public event PropertyChangedEventHandler PropertyChanged;
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        public ICommand ListViewItemSelected { get; private set; }


        public ObservableCollection<NavigationMenuItemsModel> NavigationMenuItemsModel
        {
            get { return _NavigationMenuItemsModel; }
            set
            {
                _NavigationMenuItemsModel = value;
                OnPropertyChanged();
            }
        }
        //Application.Current.MainPage.Navigation.PushPopupAsync(new LoadingIndicator());

        //public ICommand ListViewItemSelected
        //{
        //    get
        //    {
        //        return new Command((sender) =>
        //        {
        //            //var item = (e as MyModelObject);
        //            Console.WriteLine(sender);
        //            // delete logic on item
        //            var mdp = App.Current.MainPage as MasterDetailPage;
        //            mdp.Detail.Navigation.PushAsync(((NavigationMenuItemsModel)sender).NavigationPage);
        //            mdp.IsPresented = false;
        //        });
        //    }
        //}

        void OutputAge(NavigationMenuItemsModel sender)
        {
            //SelectedItemText = string.Format("{0} is {1} years old.", person.Name, person.Age);
            //OnPropertyChanged("SelectedItemText");
            //var mdp = App.Current.MainPage as MasterDetailPage;
            //mdp.Detail.Navigation.PushAsync(((NavigationMenuItemsModel)sender).NavigationPage);
            //mdp.IsPresented = false;
        }


        //private void InitCommands()
        //{
        //    try
        //    {
        //        ListViewItemSelected = new Command((sender) =>
        //        {
        //            var mdp = Application.Current.MainPage as MasterDetailPage;
        //            mdp.Detail.Navigation.PushAsync(((NavigationMenuItemsModel)sender).NavigationPage);
        //            mdp.IsPresented = false;
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        //log here
        //        throw;
        //    }
        //}

        public NavigationMenuItemsViewModel()
        {
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
                    Title="Search",
                    Icon="\uf002",
                    NavigationPage= typeof(SearchFlowerPage)
                },
                new NavigationMenuItemsModel
                {
                    Title="RequestList",
                    Icon="\uf03a",
                    NavigationPage= typeof(RequestListPage)
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
            ListViewItemSelected = new Command<NavigationMenuItemsModel>(OutputAge);
        }
    }
}

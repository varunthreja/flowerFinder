using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Xamarin.Forms;

namespace FlowerFinder
{
    public partial class RequestListPage : ContentPage
    {
        public ObservableCollection<FlowerDetailsModel> _FlowerDetailsModel;
        public ObservableCollection<FlowerDetailsModel> FlowerDetailsModel
        {
            get { return _FlowerDetailsModel; }
            set
            {
                _FlowerDetailsModel = value;
                OnPropertyChanged();
            }
        }
        public RequestListPage()
        {
            InitializeComponent();

            _FlowerDetailsModel = new ObservableCollection<FlowerDetailsModel>
            {
                new FlowerDetailsModel
                {
                    FlowerName="flower1",
                    Image="https://4.imimg.com/data4/TJ/ND/MY-36181633/fresh-rose-flower-500x500.jpg",
                    Date="09-08-2018",
                    Description="test1"
                },
                new FlowerDetailsModel
                {
                    FlowerName="flower2",
                    Image="https://images.pexels.com/photos/87840/daisy-pollen-flower-nature-87840.jpeg?auto=compress&cs=tinysrgb&h=350",
                    Date="09-08-2018",
                    Description="test2"
                }

            };
            listViewRequests.ItemsSource = _FlowerDetailsModel;
        }
    }
}

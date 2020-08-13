import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  BackHandler,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import {Card,Button,TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
  } from 'react-native-popup-dialog';
const Home = () => {
  const [currencyArr, setCurrencyArr] = useState([]);
  const [dialog,setDialog]=useState(false)
  const [deleted,setDeleted]=useState([])
  const [newPrice,setNewPrice] = useState('')
  const [newCurrency,setNewCurrency] = useState('')
  const [newPercentage,setNewPercentage] = useState('')
  const [newData,setNewData] = useState([])
  let array = []
  const data = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png',
    'data:image/png;base64,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',
    'data:image/png;base64,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',
    'https://http2.mlstatic.com/bitcoin-001-btc-criptomoneda-D_NQ_NP_859620-MLC31211226486_062019-F.jpg',
  ];
  useEffect(() => {
    setInterval(() => {
    //   console.log('This will run every 2 second!');
        getData()
    }, 2000);
  }, []);


  function getData() {
    fetch(
      'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH,DASH,REP,BTC&tsyms=USD',
    )
      .then((response) => response.json())
      .then((json) => {
        // console.log(json.DISPLAY.ETH)
        let arr = [];
        Object.entries(json.DISPLAY).map((item) => {
          for (let i = 0; i < item.length; i++) {
            var input = {
              name: item[i],
              data: item[i + 1],
            };
            arr.push(input);
            i++;
          }
        });
        currencyArr.length = 0;
        setCurrencyArr(arr);
      })
      .catch((error) => console.error(error));
  }
console.log(currencyArr)
  const renderList = (item, index) => {
      console.log(deleted)
    return (
      <View>
        <Card style={styles.myCard}>
          <View style={styles.cardView}>
            <View style={{justifyContent: 'center'}}>
              <Image
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 90 / 2,
                  alignSelf: 'center',
                }}
                source={{uri: data[index]}}></Image>
            </View>
            <View style={{justifyContent: 'center', marginLeft: '10%'}}>
              <View style={{flexDirection: 'row'}}>
                  <View style={{flex:4}}>
                <Text style={[styles.text, {color: 'lightblue'}]}>
                  {item.name}
                </Text>
                </View>
                <View style={{alignSelf:'center',flex:1}}>
                <Button 
                onPress={()=>{
                    console.log('delete pressed')
                    const deletedName = item.name
                    setCurrencyArr(currencyArr.filter(item=>item.name!=deletedName))
                    setNewData(newData.filter(item=>item.name!=deletedName))
                }}>
                  <Icon name="ios-trash-sharp" style={styles.text}></Icon>
                </Button>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.text, {fontSize: 18}]}>Price(USD)</Text>
                <Text style={[styles.text, {marginLeft: '10%', fontSize: 18}]}>
                  Change in 24 hrs
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[styles.text, {fontSize: 18, flex: 1, color: 'lime'}]}>
                  {item.data.USD.PRICE}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      fontSize: 18,
                      flex: 1,
                      color:
                        item.data.USD.CHANGEPCT24HOUR.charAt(0) == '-'
                          ? 'red'
                          : 'lime',
                    },
                  ]}>
                  {item.data.USD.CHANGEPCT24HOUR}%
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </View>
    );
  };


const createNewData=()=>{
    var input = {
        name: newCurrency,
        data: {
            USD:{
                PRICE: `$ ${newPrice}`,
                CHANGEPCT24HOUR: newPercentage
            }
        },
      };
      array.push(input); 
      setNewData(array)
      setDialog(false)
}
  return (
    <LinearGradient
      colors={['#4c669f', '#D9E4F5', '#ffffff']}
      style={{width: '100%', height: '100%'}}>
      <StatusBar translucent backgroundColor="transparent" />
      <Dialog
        onDismiss={() => {
            setDialog(false)
        }}
        width={0.9}
        visible={dialog}
        rounded
        actionsBordered
        dialogTitle={
          <DialogTitle
            title="Add Currency"
            style={{
              backgroundColor: '#F7F7F8',
            }}
            hasTitleBar={false}
            align="center"
          />
        }
        footer={
          <DialogFooter>
            <DialogButton
              text="CANCEL"
              bordered
              onPress={() => {
                setDialog(false)
            }}
              key="button-1"
            />
            <DialogButton
              text="Add"
              bordered
              onPress={() => {
                createNewData()
            }}
              key="button-2"
            />
          </DialogFooter>
        }>
        <DialogContent
          style={{
            backgroundColor: '#F7F7F8',
          }}>
              <TextInput 
              placeholder='Currency Name'
              onChangeText={(value)=>setNewCurrency(value)}
              ></TextInput>
               <TextInput 
              placeholder='Price'
              onChangeText={(value)=>setNewPrice(value)}
              ></TextInput>
               <TextInput 
              placeholder='Change in 24 hrs(%)'
              onChangeText={(value)=>{setNewPercentage(value)}}
              ></TextInput>
         </DialogContent>
      </Dialog>
      <Text
        style={{
          fontSize: 35,
          marginTop: '10%',
          color: 'white',
          alignSelf: 'center',
        }}>
        Crypto Currency
      </Text>
      <FlatList
        data={currencyArr.concat(newData)}
        renderItem={({item, index}) => {
          return renderList(item, index);
        }}
        keyExtractor={(item, index) => 'key' + index}
        style={{marginTop: '10%', alignSelf: 'center'}}></FlatList>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={()=>setDialog(true)}
        style={styles.TouchableOpacityStyle}>
        <Image
          source={{
            uri:
              'https://reactnativecode.com/wp-content/uploads/2017/11/Floating_Button.png',
          }}
          style={styles.FloatingButtonStyle}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  myCard: {
    margin: 5,
    padding: 5,
    width: SCREEN_WIDTH - 50,
    borderRadius: 25,
    backgroundColor: 'black',
  },
  cardView: {
    flexDirection: 'row',
    padding: 6,
  },
  text: {
    fontSize: 24,
    color: 'white',
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 50,
  },
  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 70,
    height: 70,
  },
});

export default Home;

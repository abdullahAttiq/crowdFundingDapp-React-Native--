import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import Web3 from 'web3';
import { abi, contractAddress } from './constant';

const backgroundImage = require('./assets/crowd.jpg');

export default function CrowdFundingDapp() {
  const [amount, setAmount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [url,setUrl]=useState(false)
  const [urlValue,setUrlValue]=useState('')

  useEffect(() => {
    // Initialize Web3
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          // Request access to accounts
          await window.ethereum.enable();
          setWeb3(web3Instance);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.error('Please install MetaMask to use this application.');
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    // Load contract data
    const loadContract = async () => {
      try {
        // Replace 'YOUR_CONTRACT_ADDRESS' with your actual contract address
        const Address = contractAddress;
        // Replace 'YOUR_CONTRACT_ABI' with your actual contract ABI (JSON format)
        
        
        const contractInstance = new web3.eth.Contract(abi, Address);
        setContract(contractInstance);
        
        
        // const receipt = await contractInstance.methods.fund().send({ from: contractAddress });
      
        // setTransactionReceipt(receipt);
      } catch (error) {
        console.error('Error loading contract:', error);
      }
    };



    if (web3) {
      loadContract();
    }
  }, [web3]);
  
    async function handleViewTransaction  () {
      console.log("hello")
    //   const transactionResponse = await contract
    //   const transactionReceipt = await transactionResponse
    //  console.log(transactionReceipt.Address)
    if (transactionReceipt && transactionReceipt.transactionHash) {
      const etherscanUrl = `https://etherscan.io/tx/${transactionReceipt.transactionHash}`;
      Linking.openURL(etherscanUrl);
      console.log(etherscanUrl)
    }
  
  }


  const handleConnectWallet = async () => {
    try {
      console.log("starting ")
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      console.log(account)
    } catch (error) {
      console.error('Error connecting to wallet:', error);

    }
    console.log(account)
  };

  const handleFund = async () => {
    try {
      // Convert the amount from Ether to Wei
      console.log(amount)
      const amountWei = web3.utils.toWei(amount, 'ether');
      
      // Call the fund function on the contract
      
      const trx=await contract.methods.fund().send({ from: account, value: amountWei });
      const transactionReceipt = await web3.eth.getTransactionReceipt(trx.transactionHash);
      console.log(transactionReceipt.transactionHash)
       const etherscanUrl = `https://sepolia.etherscan.io/tx/${transactionReceipt.transactionHash}`;
      
      console.log("thanks for supporting us .. see your transaction at ")
      console.log(etherscanUrl)
      setUrl(true)
      setUrlValue(etherscanUrl)



  
      

      // Display success message or perform any other actions after successful funding
    } catch (error) {
      console.error('Error funding:', error);
    }
   
    
  };


  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <Text style={styles.heading}>CryptoFund Dapp</Text>
          <TouchableOpacity onPress={handleConnectWallet} style={styles.button}>
            <Text style={styles.buttonText}> Connect Wallet</Text>
          </TouchableOpacity>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter Amount in ETH"
            keyboardType="numeric"
            style={styles.input}
          />
          <TouchableOpacity onPress={handleFund} style={styles.button}>
            
            <Text style={styles.buttonText}>Fund</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleViewTransaction} style={styles.button}>
            
            <Text style={styles.buttonText}>status</Text>
          </TouchableOpacity>
          <Text style={styles.url} >{url ? urlValue : "trx in process plz wait"}</Text>

          <View style={styles.developerNames}>
            <Text style={styles.developerNames2}>Developed By:</Text>
            <Text style={styles.developerName}>Abdullah Attique {'\n'} Hamid Awan {'\n'}M.Faizyab </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 50,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginVertical: 20,
    width: '80%',
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  developerNames: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
  },
  developerName: {
    color: '#ADD8E6',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5,
  },
  developerNames2: {
    color: 'yellow',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5,
  },
  url:{
    color:'#ADD8E6'
  }
});




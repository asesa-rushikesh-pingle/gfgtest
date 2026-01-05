import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../constants/variables";
import { Alert } from "react-native";

async function postFormData(branch, url, formData,setIsLoading) {
  const token = await AsyncStorage.getItem('authToken');
  setIsLoading(true)

  try {
    let headers = {
      branchSlug: branch.toLowerCase(),
      Authorization: `Bearer ${token}`,
    };
    // headers['Content-Type'] = 'application/json'

    const res = await fetch(`${baseUrl}${url}`, {
      method: "POST",
      headers: headers,
      body: formData,
    });
    if (res.status == 401) {
      // navigate('/login')
    //   window.location.href = "/login";
      Alert.alert('Please login', 'Token is expired!')
      setIsLoading(false)
      return;
    }
    const data = await res.json();

    if (data.status) {
      setIsLoading(false)
      return data;
    } else {
    //   toast.warn(data.message);
      Alert.alert(data.message)
      console.log(data.message,"err")

      setIsLoading(false)
    }
  } catch (error) {
    console.log(error);
    setIsLoading(false)
    Alert.alert("Something went wrong");
  }
}

async function postJSONData(branch, url, JSONData) {
    const token = await AsyncStorage.getItem('authToken');
  try {
    let headers = {
      branchSlug: branch.toLowerCase(),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const res = await fetch(`${baseUrl}${url}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(JSONData),
    });
    if (res.status == 401) {
      // navigate('/login')
    //   window.location.href = "/login";
    Alert.alert('Please login')
      return;
    }
    const data = await res.json();

    if (data.status) {
      return data;
    } else {
        Alert.alert(data.message);
        console.log(data.message,"err")
    }
  } catch (error) {
    console.log(error);
    Alert.alert("Something went wrong");
  } finally {
  }
}

async function getData(branch, url, params = {},controller) {
    const token = await AsyncStorage.getItem('authToken');

  try {
    let headers = {
      branchSlug: branch.toLowerCase(),
      Authorization: `Bearer ${token}`,
    };
    headers["Content-Type"] = "application/json";

    const queryString = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      )
    ).toString();

    const res = await fetch(
      `${baseUrl}${url}${queryString ? "?" : ""}${queryString}`,
      {
        signal : controller.signal,
        method: "GET",
        headers: headers,
      }
    );
    console.log("res.status",res.status)
    if (res.status == 401) {
      // navigate('/login')
    //   window.location.href = "/login";
    Alert.alert('Please login')
      return;
    }
    const data = await res.json();
    // console.log("data ***********" ,data)
    if(data){
      if (data && data.status) {
        return data;
      } else {
          Alert.alert(data.message);
          console.log('error api',url)
          console.log('error message',data.message)
      }
    }else{
      
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log("Request was aborted");
      return; // just exit silently
    }
    console.log(error);
    Alert.alert("Something went wrong !!");
  }
}

export { postFormData, getData, postJSONData };

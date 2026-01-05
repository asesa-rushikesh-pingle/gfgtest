



import { View, Text, TextInput } from 'react-native'
import React from 'react'

export default function TextInputComp({placeholder='',state='',setState=()=>{},bordered=false}) {
  return (
    <TextInput
    style={{ borderWidth : bordered ? .5 : 0, borderColor : 'white', paddingVertical : 12, paddingHorizontal : 16 , backgroundColor : '#202020', borderRadius : 10, color : 'white', fontSize : 16, fontWeight : '500', marginTop : 16}}
    placeholder={placeholder}
    value={String(state)}
    onChangeText={(val)=>{setState(val)}}
    placeholderTextColor={'#656565'}
    />
  )
}
import { TextInput } from 'react-native'
import React from 'react'
import { useTheme } from '../../context/ThemeContext'

export default function TextInputComp({placeholder='',state='',setState=()=>{},bordered=false, onFocus}) {
  const { theme } = useTheme()
  return (
    <TextInput
    style={{
      borderWidth : bordered ? .5 : 1,
      borderColor : bordered ? theme.border : theme.border,
      paddingVertical : 12,
      paddingHorizontal : 16 ,
      backgroundColor : theme.inputBg,
      borderRadius : 10,
      color : theme.inputText,
      fontSize : 16,
      fontWeight : '500',
      marginTop : 16
    }}
    placeholder={placeholder}
    value={String(state)}
    onChangeText={(val)=>{setState(val)}}
    onFocus={onFocus}
    placeholderTextColor={theme.placeholder}
    />
  )
}

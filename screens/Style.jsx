import { View, Text, StyleSheet,Dimensions } from 'react-native'
import React from 'react'





const styles = StyleSheet.create({
  lnoRefText:{
    width : 50,
    textAlign : 'center',
    fontSize : 12,textAlign : 'center', fontWeight : '400', color : '#EB6925',  
  },
  dchtegray:{
    fontSize : 12, fontWeight : '400',  color : '#A8A8A8',  
  },
  dchtegraytm:{
    fontSize : 20, fontWeight : '700',  color : '#fff',  marginTop : 10
  },
  lnoRefTextNum:{
    fontSize : 20,textAlign : 'center', fontWeight : '700', marginTop : 10, color : '#EB6925',  
  },
  chchvdeyai:{
    width : ((Dimensions.get('window').width - 52) / 7) * 3, paddingVertical : 5, paddingHorizontal : 10, backgroundColor : '#202020', borderRadius : 5  
  },
  laBoxRef:{
     paddingVertical : 5, paddingHorizontal : 3, backgroundColor : '#481D07', borderRadius : 5  , width : ((Dimensions.get('window').width - 52) / 7) * 1
  },
  coverlayyy:{
    overflow : 'hidden',
    position : 'absolute',
    bottom  : 0,
    left  : 0,
    right  : 0,
    paddingVertical : 10, 
    paddingHorizontal : 16,
  },
  pageBarTitle:{
    fontSize : 16,
    fontWeight : '600',
    lineHeight : 22,
    color : 'white'
  },
    gPrasctie : {
      color : '#A8A8A8',
      fontSize : 12, 
      fontWeight : '400'
    },
    dcard:{
      height : 84,
      justifyContent : 'space-between',
      alignItems : 'flex-start',
      padding : 10,
      borderRadius : 5,
      backgroundColor : '#202020',
      width : (Dimensions.get('window').width - 52) / 3
    },
    chip:{
      paddingVertical : 3, 
      paddingHorizontal : 5,
      borderRadius : 5, 
      backgroundColor : '#2B2B2B',
      color : '#A8A8A8',
      fontSize : 12, 
      fontWeight : '400'
  
    },
    chipss:{
      marginTop:10,
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'center',
      gap : 6,
      flexWrap : 'wrap',
  
  
    },
    moodInner:{
      marginTop : 10,
      padding:10,
      borderRadius : 16,
      backgroundColor : '#202020'
    },
    moRegTitle:{
      color : 'white',
      fontSize  : 16, 
      fontWeight : '400',
      textAlign : 'center'
    },
    moodLable:{
      color : 'white',
      fontSize  : 16, 
      fontWeight : '600',
      lineHeight : 22
    },
    moodTitleBox:{
      flexDirection : 'row',
      columnGap : 10,
      alignItems : 'center',
      justifyContent : 'f-start'
    },
    moodBoxWaraper:{
      marginTop : 26,
      paddingHorizontal : 16,
  
    },
    moreInfoBtn:{
      marginTop : 26,
      paddingVertical : 4, 
      borderRadius : 10,
      backgroundColor : '#481D07',
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'center',
      columnGap : 2,
    },
    btnTextt:{
      color : '#EB6925',
      fontSize  : 16, 
      fontWeight : '600',
  
    },
    timeTexttt:{
      color : 'white',
      fontSize  : 12, 
      fontWeight : '700',
      marginTop : 3
  
    },
    chinTexttt:{
      color : '#A8A8A8',
      fontSize  : 10, 
      fontWeight : '400',
  
    },
    cheLeftCont:{
      columnGap : 10,
      flex : 1,
      paddingRight : 15,
      flexDirection : 'row',
      alignItems : 'flex-start',
      justifyContent : 'flex-start'
    },
    checkContView:{
      marginTop : 6,
      flexDirection : 'row',
      alignItems : 'flex-end',
      justifyContent : 'space-between'
    },
    mentalTraiView:{
      marginTop : 16,
      borderRadius : 10,
      borderColor : '#383838',
      borderWidth : .5,
      padding : 10,
    },
    courseContentt:{
      flex : 1
    },
    imgCont:{
  flexDirection : 'row',
  alignItems : 'flex-start',
  justifyContent : 'flex-start',
  columnGap : 10
    },
    courseCardsMain : {
      paddingHorizontal : 16,
  
      marginTop : 10,
      
    },
    secCardCurse:{
      marginTop : 10,
      padding : 10,
      borderRadius : 16,
      backgroundColor : '#202020'
    },
    sunHeadingCourgfdh : {
      color : '#A8A8A8',
      marginTop : 6,
      fontSize : 14,
      lineHeight : 22 ,
      fontWeight : '400'
    },
    ongoingtext : {
      paddingVertical : 3,
      paddingHorizontal : 5, 
      borderRadius : 5, 
      backgroundColor  : '#2B2B2B',
  
      color : '#2BA750',
      fontSize : 12,
      fontWeight : '400'
  
    },
    codescr : {
      color : 'white',
      fontSize : 14,
      fontWeight : '400'
    },
    staMonthText : {
      color : '#A8A8A8',
      fontSize : 12,
      fontWeight : '400'
    },
    mainHead : {
      color : 'white',
      fontSize : 20,
      lineHeight : 22 ,
      fontWeight : '600'
    },
    achBox:{
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'space-between',
      marginTop : 20
    },
    taLimitView:{
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'space-between'
    },
  
    goldText:{
      color : '#FDE59D',
      fontSize : 14,
      marginTop : 4,
      lineHeight : 22,
      fontWeight : '700'
    },
    coHeadinggg:{
      color : 'white',
      fontSize : 16,
      fontWeight : '500'
    },
    firstText:{
      color : 'white',
      fontSize : 20,
      lineHeight : 22,
      fontWeight : '700'
    },
    taTiLab:{
      color : '#A8A8A8',
      fontSize : 6,
      lineHeight : 16,
      fontWeight : '400'
    },
    proTitle:{
      color : '#A8A8A8',
      fontSize : 12,
      lineHeight : 22,
      fontWeight : '400'
     
    },
    percenten:{
      color : 'white',
      fontSize : 20,
      lineHeight : 22,
      fontWeight : '700',
      marginTop : 10,
    },
    progressView:{
      marginRight : 16,
      width : 160,
      padding : 10,
      backgroundColor : '#202020',
      borderRadius : 10,
  
    },
    gaphicalHeroView:{
      paddingTop : 16,
      // paddingLeft : 16,
      paddingBottom : 16
    },
    brachName:{
      fontSize : 14,
      fontWeight : '400',
      lineHeight : 19,
      color : 'white'
    },
    leftHead:{
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'flex-start',
      columnGap : 16,
    },
    headComp:{
      paddingHorizontal : 16,
      paddingBottom : 16,
      paddingTop : 10,
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'space-between'
    },
    absolute: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    parentWrapper : {
      flex : 1,
      backgroundColor : 'black'
    },
    calendar: {
      height: 120,
      paddingTop: 15,
      // paddingBottom: 10,
    }
  })


  export default styles
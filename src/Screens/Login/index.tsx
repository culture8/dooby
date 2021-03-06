import {KakaoOAuthToken, login, logout} from '@react-native-seoul/kakao-login';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Edge, useSafeAreaInsets} from 'react-native-safe-area-context';
import {loginWithKakaoTalk} from '~/stores/actions/auth/authActions';
import axios from 'axios';
import {accessTokenConfig} from '~/utils/config';
import {KAKAO_TOKEN_CONTROLLER} from '~/constants/constants';

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#FEE500',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
const Login = ({navigation}) => {
  const [result, setResult] = useState<string>('');

  const signInWithKakao = async (): Promise<void> => {
    const token: KakaoOAuthToken = await login();
    setResult(JSON.stringify(token));

    const res = await axios.get(
      `${KAKAO_TOKEN_CONTROLLER}/${token.accessToken}`,
    );
    const ACCESS_TOKEN = res.data.accessToken;
    console.log(ACCESS_TOKEN);
    if (res?.status === 200) {
      console.log('success');
      onMovePage();
    } else {
      console.log('fail');
    }

    const getAuth = await axios.get(
      'http://61.100.16.155:8080/api/member/auth/get-auth',
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      },
    );
  };

  // const dispatch = useDispatch();
  // const {navigation} = props;

  // const onHandleLoginWithKakaoTalk = useCallback(async (): Promise<void> => {
  //   try {
  //     const token: KakaoOAuthToken = await login();
  //     const kakaotalkToken = token.accessToken;
  //     requestAnimationFrame(() => {
  //       dispatch(
  //         loginWithKakaoTalk({kakaotalkToken}, (isSuccess, errMessage) => {
  //           try {
  //             logout();
  //           } catch (error) {}
  //           if (isSuccess) {
  //             onMovePage();
  //           }
  //           console.log(token);
  //         }),
  //       );
  //     });
  //   } catch (error) {
  //     if (error) {
  //       console.log('error: ', error);
  //     }
  //   }
  // }, []);
  const onMovePage = useCallback(() => {
    navigation.navigate('Basic1');
  }, []);
  return (
    <View>
      <Text
        style={{
          fontSize: 30,
          marginTop: 300,
          textAlign: 'center',
          marginBottom: 20,
        }}>
        ?????? ????????? {'\n'} ????????????
      </Text>
      <TouchableOpacity onPress={() => signInWithKakao()}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>????????? ?????????</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

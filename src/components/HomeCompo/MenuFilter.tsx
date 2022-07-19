import React, {useEffect, useRef, useState, Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
  Button,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';

import CategoryFilter from '~/Components/HomeCompo/FilterSubComponent/CategoryFilter';

const FilterHeaderContainer = styled.View`
  flex-direction: row;
`;
const FilterHeaderText = styled.Text`
  font-weight: bold;
  font-size: 17px;
  margin-right: 20px;
  margin-left: 5px;
  margin-top: 20px;
  margin-bottom: 15px;
`;
const FilterHeaderButton = styled.TouchableOpacity``;
const BottomSheet = (props, {navigation}) => {
  const {modalVisible, setModalVisible} = props;
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 1.5) {
          closeModal();
        } else {
          resetBottomSheet.start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (props.modalVisible) {
      resetBottomSheet.start();
    }
  }, [props.modalVisible]);

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setModalVisible(false);
    });
  };
  console.log(navigation);
  return (
    <>
      <Modal
        visible={modalVisible}
        animationType={'fade'}
        transparent
        statusBarTranslucent>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.background} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={{
              ...styles.bottomSheetContainer,
              transform: [{translateY: translateY}],
            }}
            {...panResponders.panHandlers}>
            <FilterHeaderContainer>
              <FilterHeaderButton
                onPress={() => navigation.navigate('CategoryFilter')}>
                <FilterHeaderText>카테고리</FilterHeaderText>
              </FilterHeaderButton>
              <FilterHeaderButton
                onPress={() => navigation.navigate('NutrientFilter')}>
                <FilterHeaderText>영양성분</FilterHeaderText>
              </FilterHeaderButton>
              <FilterHeaderButton>
                <FilterHeaderText>가격</FilterHeaderText>
              </FilterHeaderButton>
              <FilterHeaderButton>
                <FilterHeaderText>식단구성</FilterHeaderText>
              </FilterHeaderButton>
            </FilterHeaderContainer>
            <CategoryFilter />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  background: {
    flex: 1,
  },
  bottomSheetContainer: {
    height: 500,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  rootContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const FilterButton = (list, pressButton) => {
  // console.log(list);
  return (
    <TouchableOpacity style={styles.button} onPress={list.onPress}>
      <Text>{list.list}</Text>
    </TouchableOpacity>
  );
};

const BottomSheetTestScreen = filterMenus => {
  const [modalVisible, setModalVisible] = useState(false);
  const pressButton = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.rootContainer}>
      {/* <Button title={filterMenus.children} onPress={pressButton} /> */}
      <FilterButton list={filterMenus.children} onPress={pressButton} />
      <BottomSheet
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

export default BottomSheetTestScreen;

import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, Button, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../context/AuthContext";
import { AuthStackNavigationProp } from "../types/navigationAuthType";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<AuthStackNavigationProp>();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext?.user) {
      if (authContext.user.role === "Customer") {
        navigation.replace("CustomerNavigator");
      } else if (authContext.user.role === "Consulting") {
        navigation.replace("ConsultingNavigator");
      } else if (authContext.user.role === "Delivery") {
        navigation.replace("DeliveryNavigator");
      }
    }
  }, [authContext?.user]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    setLoading(true);
    await authContext?.login(email, password);
    setLoading(false);
  };

  return (
    <View>
      <Text>
        Tình trạng ùn tắc giao thông ở phố cổ và quanh Hồ Gươm diễn ra nhiều
        năm, gây ùn tắc, ô nhiễm tiếng ồn và không khí. Người dân nhiều lần phản
        ánh trong các buổi tiếp xúc cử tri với đại biểu HĐND quận, thành phố. Từ
        năm 2023, quận Hoàn Kiếm đề xuất thành phố hạn chế ôtô trên 16 chỗ ngồi
        hoạt động trong khu vực phố cổ và xung quanh Hồ Gươm trong giờ cao điểm
        (sáng từ 6h đến 9h, chiều từ 16h đến 19h30). Thành phố đã giao Sở Giao
        thông Vận tải, Công an thành phố, Sở Du lịch nghiên cứu phương án hạn
        chế phương tiện theo kiến nghị của quận Hoàn Kiếm.
      </Text>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Button title="Login" onPress={handleLogin} />
          <Button
            title="Register"
            onPress={() => navigation.navigate("Register")}
          />
        </>
      )}
    </View>
  );
};

export default LoginScreen;

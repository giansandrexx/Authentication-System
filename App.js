import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { initDatabase, registerUser, loginUser } from "./utils/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    initDatabase();
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const status = await AsyncStorage.getItem("isLoggedIn");
    if (status == "true") {
      setIsLoggedIn(true);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const success = await loginUser(username, password);
        if (success) {
          setIsLoggedIn(true);
        } else {
          Alert.alert("Error", "Invalid credentials");
        }
      } else {
        const success = await registerUser(username, password);
        if (success) {
          setIsLoggedIn(true);
        } else {
          Alert.alert("Error", "Failed to register");
        }
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  if (isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Image
            source={require("./assets/user.png")}
            style={styles.profilePicture}
          />
          <Text>Welcome, {username}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Authentication System</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.mainButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {isLogin ? "Login" : "Register"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text>
              {isLogin ? "New User? Create Account" : "Already a user? Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f4f4f9",
  },
  formContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    paddingVertical: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fafafa",
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    fontFamily: "Roboto",
  },
  mainButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
    width: "100%",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  switchButton: {
    marginTop: 25,
    alignItems: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});

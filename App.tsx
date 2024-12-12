import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Home, Grid, BarChart2 } from 'lucide-react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddTransactionScreen } from './src/screens/AddTransactionScreen';
import { CategoriesScreen } from './src/screens/CategoriesScreen';
import { AddCategoryScreen } from './src/screens/AddCategoryScreen';
import { ReportsScreen } from './src/screens/ReportsScreen';
import { initDatabase } from './src/database/database';
import { theme } from './src/theme/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.background,
      headerTitleStyle: {
        ...theme.typography.h3,
      },
    }}
  >
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ title: 'Finance Manager' }}
    />
    <Stack.Screen
      name="AddTransaction"
      component={AddTransactionScreen}
      options={{ title: 'Add Transaction' }}
    />
  </Stack.Navigator>
);

const CategoriesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.background,
      headerTitleStyle: {
        ...theme.typography.h3,
      },
    }}
  >
    <Stack.Screen
      name="CategoriesScreen"
      component={CategoriesScreen}
      options={{ title: 'Categories' }}
    />
    <Stack.Screen
      name="AddCategory"
      component={AddCategoryScreen}
      options={{ title: 'Add Category' }}
    />
  </Stack.Navigator>
);

const ReportsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.background,
      headerTitleStyle: {
        ...theme.typography.h3,
      },
    }}
  >
    <Stack.Screen
      name="ReportsScreen"
      component={ReportsScreen}
      options={{ title: 'Reports' }}
    />
  </Stack.Navigator>
);

function App(): React.JSX.Element {
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    setupDatabase();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.secondary,
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              borderTopColor: theme.colors.border,
              height: 64,
              paddingBottom: 8,
              paddingTop: 8,
            },
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Home size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Categories"
            component={CategoriesStack}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Grid size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Reports"
            component={ReportsStack}
            options={{
              tabBarIcon: ({ color, size }) => (
                <BarChart2 size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
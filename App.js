import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ImageBackground, TextInput, Switch } from 'react-native';
import axios from 'axios';
import { useEffect } from 'react';

const App = () => {
    const { data, loading, error } = useFetchData('https://dev.iqrakitab.net/api/books');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [language, setLanguage] = useState('english'); // Default language is English

    useEffect(() => {
        if (data && data.data) {
            const filteredBooks = data.data.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredData(filteredBooks);
        }
    }, [searchQuery, data]);
    

    const toggleLanguage = () => {
        setLanguage(prevLanguage => prevLanguage === 'english' ? 'urdu' : 'english');
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorScreen error={error} />;
    }

    return (
        <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>{language === 'english' ? 'زبان تبدیل کریں' : 'Change Language'}</Text>
                    <Switch
                        style={styles.toggleSwitch}
                        value={language === 'english' ? false : true}
                        onValueChange={toggleLanguage}
                        thumbColor="#fff"
                        trackColor={{ false: '#ccc', true: '#ccc' }}
                    />
                    <Text style={styles.title}>{language === 'english' ? 'Book Collection' : 'کتابوں کا مجموعہ'}</Text>
                </View>
                <TextInput
                    style={styles.searchInput}
                    placeholder={language === 'english' ? 'Search by book name' : 'کتاب کا نام سرچ کریں'}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                />
                <FlatList
                    data={filteredData}
                    renderItem={({ item }) => <BookItem book={item} language={language} />}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.flatList}
                />
            </View>
        </ImageBackground>
    );
};

const BookItem = ({ book, language }) => {
    const getTitle = () => {
        return language === 'english' ? book.title : translateToEnglish(book.title);
    };

    const translateToEnglish = (text) => {
        // You would implement your translation logic here
        // For demonstration purposes, let's assume it just returns the same text
        return text;
    };

    return (
        <View style={styles.bookContainer}>
            <Image source={require('../assets/images/sampleCover.jpeg')} style={styles.coverPhoto} />
            <View style={styles.bookDetails}>
                <Text style={styles.title}>{getTitle()}</Text>
                <Text style={styles.author}>{language === 'english' ? 'Author' : 'مصنف'}: {book.author.name}</Text>
                <Text style={styles.category}>{language === 'english' ? 'Category' : 'زمرہ'}: {book.category.name}</Text>
            </View>
        </View>
    );
};


const useFetchData = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
    </View>
);

const ErrorScreen = ({ error }) => (
    <View style={styles.errorContainer}>
        <Text>Error: {error.message}</Text>
    </View>
);

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    toggleSwitch: {
        transform: [{ scaleX: -1 }], // This flips the switch horizontally
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    flatList: {
        flexGrow: 1,
    },
    bookContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 215, 1)',
        borderRadius: 10,
        overflow: 'hidden',
    },
    coverPhoto: {
        width: 100,
        height: 150,
    },
    bookDetails: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    author: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    category: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default App;

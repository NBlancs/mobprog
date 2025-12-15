// components/RatingStars.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface RatingStarsProps {
    rating: number; // 0.0 to 5.0
    reviews?: number; // Optional number of reviews to display
    size?: number;
    color?: string;
    showReviews?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
    rating,
    reviews,
    size = 14,
    color = "#FFC700", // Yellow for stars
    showReviews = false,
}) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(<FontAwesome key={`full-${i}`} name="star" size={size} color={color} />);
    }

    // Half star
    if (hasHalfStar) {
        stars.push(<FontAwesome key="half" name="star-half-o" size={size} color={color} />);
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FontAwesome key={`empty-${i}`} name="star-o" size={size} color={color} />);
    }

    return (
        <View style={styles.container}>
            <View style={styles.starContainer}>
                {stars}
            </View>
            {showReviews && reviews !== undefined && (
                <Text style={[styles.reviewText, { fontSize: size * 0.9 }]}>
                    ({reviews})
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starContainer: {
        flexDirection: 'row',
        gap: 3,
    },
    reviewText: {
        marginLeft: 5,
        color: '#666',
        fontWeight: '500',
    },
});

export default RatingStars;
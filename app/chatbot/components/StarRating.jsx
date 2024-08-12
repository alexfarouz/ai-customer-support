import React, { useState, useEffect } from 'react';
import { Rating } from '@mui/material';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase'; // Adjust the import based on your project structure
import { useUser } from '@clerk/nextjs';

export default function StarRating() {
  const { user } = useUser();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      if (user) {
        const ratingRef = doc(db, 'users', user.id, 'rating', 'userRating'); // Fetch rating document
        const ratingSnap = await getDoc(ratingRef);
        if (ratingSnap.exists()) {
          setValue(ratingSnap.data().rating || 0);
        }
      }
    };

    fetchRating();
  }, [user]);

  const handleRatingChange = async (newValue) => {
    setValue(newValue);
    if (user) {
      const ratingRef = doc(db, 'users', user.id, 'rating', 'userRating');
      await setDoc(ratingRef, { rating: newValue }, { merge: true });
    }
  };

  return (
    <Rating
      name="user-rating"
      value={value}
      onChange={(event, newValue) => handleRatingChange(newValue)}
      size="medium"
      sx={{
        color: 'gold',
        '& .MuiRating-iconEmpty': {
          color: 'gray',
        },
      }}
    />
  );
}

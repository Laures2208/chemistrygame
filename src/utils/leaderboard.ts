import { collection, addDoc, query, orderBy, limit, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export const getLocalUserId = () => {
  let uid = localStorage.getItem('localUserId');
  if (!uid) {
    uid = 'guest_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('localUserId', uid);
  }
  return uid;
};

/**
 * Lưu điểm số của người chơi lên Firestore
 */
export async function saveScore(playerName: string, completionTime: number, accuracy: number) {
  const path = 'leaderboard';
  try {
    const entry = {
      playerName,
      completionTime,
      accuracy,
      createdAt: serverTimestamp(),
      userId: getLocalUserId()
    };
    await addDoc(collection(db, path), entry);
    console.log("Score saved successfully!");
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  completionTime: number;
  accuracy: number;
  createdAt: any;
  userId?: string;
}

/**
 * Lắng nghe top 10 điểm số (thời gian ngắn nhất, accuracy > 95%) realtime.
 * Trả về một hàm unsubscribe để huỷ listening khi component unmount.
 */
export function getTopScores(callback: (scores: LeaderboardEntry[]) => void) {
  const path = 'leaderboard';
  
  // Để tránh yêu cầu Composite Index trên Firestore cho where và orderBy khác trường (khá phiền phức trong demo),
  // chúng ta thay vì orderBy combined thì gọi tối đa 50 kết quả thời gian tốt nhất, sau đó filter client-side.
  const topScoresQuery = query(
    collection(db, path),
    orderBy("completionTime", "asc"),
    limit(50)
  );

  const unsubscribe = onSnapshot(topScoresQuery, (snapshot) => {
    let scores = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LeaderboardEntry[];
    
    // Filter accuracy > 95 and slice top 10
    scores = scores.filter(s => s.accuracy > 95);
    scores = scores.slice(0, 10);

    callback(scores);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });

  return unsubscribe;
}

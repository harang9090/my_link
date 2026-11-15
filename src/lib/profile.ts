import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  email?: string;
  photoURL?: string;
  updatedAt?: unknown;
}

/**
 * 이메일 앞부분을 기반으로 안전한 기본 username 생성
 */
export function generateDefaultUsername(email?: string | null): string {
  if (!email) {
    return `user_${Math.random().toString(36).substring(2, 7)}`;
  }
  const prefix = email.split("@")[0] || "user";
  // 영문 소문자, 숫자, _, - 만 허용
  let cleaned = prefix.toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  if (cleaned.length < 3) {
    cleaned = (cleaned + "_user").substring(0, 15);
  }
  if (cleaned.length > 20) {
    cleaned = cleaned.substring(0, 20);
  }
  return cleaned;
}

/**
 * username 유효성 및 중복 확인
 */
export async function checkUsernameAvailability(
  username: string,
  currentUserId?: string
): Promise<{ available: boolean; error?: string }> {
  const trimmed = username.trim().toLowerCase();

  // 형식 검사 (영문, 숫자, _, - 만 허용, 3~20자)
  if (!trimmed) {
    return { available: false, error: "username을 입력해 주세요." };
  }
  if (!/^[a-z0-9_-]{3,20}$/.test(trimmed)) {
    return {
      available: false,
      error: "username은 영문 소문자, 숫자, 밑줄(_), 하이픈(-) 3~20자여야 합니다.",
    };
  }

  try {
    // 1. usernames 색인 컬렉션 확인
    const usernameDocRef = doc(db, "usernames", trimmed);
    const usernameSnap = await getDoc(usernameDocRef);

    if (usernameSnap.exists()) {
      const data = usernameSnap.data();
      if (data && data.uid && data.uid !== currentUserId) {
        return {
          available: false,
          error: "이미 다른 사용자가 사용 중인 username입니다.",
        };
      }
    }

    // 2. users 컬렉션 직접 쿼리 확인
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", trimmed));
    const querySnapshot = await getDocs(q);

    for (const docItem of querySnapshot.docs) {
      if (docItem.id !== currentUserId) {
        return {
          available: false,
          error: "이미 다른 사용자가 사용 중인 username입니다.",
        };
      }
    }

    return { available: true };
  } catch (error) {
    console.error("username 중복 확인 중 오류:", error);
    // 중복 확인 실패 시 기본 안전 처리
    return {
      available: false,
      error: "중복 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}

/**
 * 사용자 프로필 조회 (users/{userId}/profile 경로 우선)
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!userId) return null;

  try {
    // 1. users/{userId}/profile/info 확인
    const profileSubDocRef = doc(db, "users", userId, "profile", "info");
    const subSnap = await getDoc(profileSubDocRef);

    if (subSnap.exists()) {
      return subSnap.data() as UserProfile;
    }

    // 2. users/{userId} 확인
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      if (data.profile) {
        return data.profile as UserProfile;
      }
      if (data.username || data.displayName || data.bio) {
        return {
          username: data.username || "",
          displayName: data.displayName || "",
          bio: data.bio || "",
          email: data.email || "",
          photoURL: data.photoURL || "",
        };
      }
    }

    return null;
  } catch (error) {
    console.error("프로필 조회 오류:", error);
    return null;
  }
}

/**
 * username으로 프로필 조회 (공유 URL용)
 */
export async function getProfileByUsername(
  username: string
): Promise<UserProfile | null> {
  if (!username) return null;

  try {
    const trimmed = username.trim().toLowerCase();

    // 1. usernames 색인에서 uid 찾기
    const usernameSnap = await getDoc(doc(db, "usernames", trimmed));
    if (usernameSnap.exists()) {
      const { uid } = usernameSnap.data();
      if (uid) {
        return await getUserProfile(uid);
      }
    }

    // 2. users 컬렉션 직접 쿼리
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", trimmed));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const userDoc = snap.docs[0];
      return await getUserProfile(userDoc.id);
    }

    return null;
  } catch (error) {
    console.error("username 조회 오류:", error);
    return null;
  }
}

/**
 * 프로필 저장 (중복 검사 및 users/{userId}/profile 저장)
 */
export async function saveUserProfile(
  userId: string,
  data: {
    username: string;
    displayName: string;
    bio: string;
    email?: string;
    photoURL?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  if (!userId) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const cleanUsername = data.username.trim().toLowerCase();

  // 1. 중복 및 유효성 체크
  const check = await checkUsernameAvailability(cleanUsername, userId);
  if (!check.available) {
    return { success: false, error: check.error };
  }

  try {
    // 2. 기존 프로필의 username과 다른 경우 기존 username 색인 정리
    const currentProfile = await getUserProfile(userId);
    const oldUsername = currentProfile?.username?.trim().toLowerCase();
    if (oldUsername && oldUsername !== cleanUsername) {
      try {
        await deleteDoc(doc(db, "usernames", oldUsername));
      } catch (e) {
        console.warn("이전 username 색인 삭제 경고:", e);
      }
    }

    // 3. 새 username 색인 저장
    await setDoc(doc(db, "usernames", cleanUsername), {
      uid: userId,
      username: cleanUsername,
      updatedAt: serverTimestamp(),
    });

    const profilePayload = {
      username: cleanUsername,
      displayName: data.displayName.trim(),
      bio: data.bio.trim(),
      email: data.email || "",
      photoURL: data.photoURL || "",
      updatedAt: serverTimestamp(),
    };

    // 4. users/{userId}/profile 저장 (서브컬렉션 doc: users/{userId}/profile/info)
    const profileSubRef = doc(db, "users", userId, "profile", "info");
    await setDoc(profileSubRef, profilePayload, { merge: true });

    // 5. users/{userId} 메인 문서에도 병합 저장
    const userDocRef = doc(db, "users", userId);
    await setDoc(
      userDocRef,
      {
        ...profilePayload,
        profile: {
          username: cleanUsername,
          displayName: data.displayName.trim(),
          bio: data.bio.trim(),
        },
      },
      { merge: true }
    );

    return { success: true };
  } catch (error: unknown) {
    console.error("프로필 저장 실패:", error);
    const message =
      error instanceof Error ? error.message : "프로필 저장에 실패했습니다.";
    return { success: false, error: message };
  }
}

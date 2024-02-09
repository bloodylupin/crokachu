export default function userNameInterpolation(account?: string | null) {
  return `${account?.slice(2, 5)}...${account?.slice(0 - 3)}`;
}

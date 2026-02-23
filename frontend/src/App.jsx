import { useContext } from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthContext } from "./context/AuthContext";


function App() {
  const { loading } = useContext(AuthContext);

  // Show loading while checking JWT on refresh
  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <h2>Loading EduSphere...</h2>
      </div>
    );
  }

  return <AppRoutes />;
}

const styles = {
  loaderContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },
};

export default App;

// function App() {
//   return (
//     <div className="h-screen bg-blue-500 flex items-center justify-center">
//       <h1 className="text-white text-4xl font-bold">
//         Tailwind Working 🚀
//       </h1>
//     </div>
//   );
// }
// export default App;
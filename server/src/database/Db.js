
    import mongoose from "mongoose";

    const Db = async () => {
      try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("📡 Database Connected:", conn.connection.host);
      } catch (err) {
        console.log("❌ Database Error:", err.message);
        throw err; // Throw error to prevent server from starting without DB
      }
    };

    export default Db;
    
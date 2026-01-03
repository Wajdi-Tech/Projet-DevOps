"use client"; // Assurez-vous que c'est un Client Component

import Navbar from "@/components/Navbar";
import Products from "@/components/products/Products";
import Main from "@/components/Main";
import { Toaster } from "react-hot-toast";



export default function Home() {



  

  return (
    <div>
      <Toaster />
      <Navbar />
     <Main />    
    </div>
  );
}

import React, { useState, useEffect } from "react";
import AddCard from "../../components/AddCard";
import AddBrandDialog from "../BrandDialog/AddBrandDialog";
import BrandCard from "../../components/BrandCard";
import "./Dashboard.css";
import PublishedStore from "../PublishedStore/PublishedStore";

function Dashboard({ supabase, user }) {
  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

  async function fetchData() {
    const { data, error } = await supabase.from("Brands").select("*");
    console.log(user.email);
    if (error) {
      return;
    }
    setBrands(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Brands",
        },
        (payload) => {
          console.log(brands);
          if (payload.eventType === "INSERT") {
            setBrands((prevBrands) => [...prevBrands, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setBrands((prevBrands) =>
              prevBrands.map((brand) =>
                brand.id === payload.new.id ? payload.new : brand
              )
            );
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [supabase, brands]);

  const onButtonClick = () => {
    setSelectedBrand(null);
    setOpen(true);
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setOpen(true);
  };

  const handleDelete = async (brandId) => {
    const { error } = await supabase.from("Brands").delete().eq("id", brandId);
    if (error) {
      console.error("Error deleting brand:", error);
    } else {
      setBrands((prevBrands) => prevBrands.filter((brand) => brand.id !== brandId));
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBrand(null);
    fetchData();
  };

  return (
    <div className="dashboard">
      <AddCard onButtonClick={onButtonClick} />
      {brands.map((brand, index) => (
        <BrandCard
          key={brand.id}
          brandName={brand.brandName}
          description={brand.description}
          onEdit={() => handleBrandClick(brand)}
          onDelete={() => handleDelete(brand.id)}
          category={brand.category}
          contactEmail={brand.contactEmail}
        />
      ))}
      <AddBrandDialog
        supabase={supabase}
        open={open}
        onClose={handleClose}
        brand={selectedBrand}
        user={user.email}
      />
    </div>
  );
}

export default Dashboard;

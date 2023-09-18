"use client";
import { GET_ALL_DEVICES } from "@/graphql/schemas/devicesSchema";
import { ColumnDefBase } from "@tanstack/react-table";
import { TableComponent } from "../Table/Table";
import defaultColumns, {
  DeviceModel,
  generateDeviceTableHeaderElements,
} from "./devicesAnnexes/devicesPageTemplate";
import { useEffect, useState } from "react";
import { Snackbar } from "../SnackBar";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { TableHeader } from "../Table/TableHeader";

export const AllDevicesPage = ({
  searchParams,
}: {
  searchParams: Record<string, string | boolean>;
}) => {
  const [cityFilter, setCityFilter] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (searchParams?.action === "true") {
      router.replace("/devices");
      toast.custom(
        <Snackbar
          type="success"
          message={`Device ${
            searchParams?.type === "add" ? "added" : "updated"
          } succesfully`}
        />
      );
    }
  }, [searchParams, router]);

  const deviceTableHeaderElements = generateDeviceTableHeaderElements(router);

  const polishedDeviceTableHeaderElements = {
    searchInput: {
      ...deviceTableHeaderElements.searchInput,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        setCityFilter(event.target.value as string),
    },
    addNew: deviceTableHeaderElements.addNew,
    delete: deviceTableHeaderElements.delete,
  };

  return (
    <div className="h-full px-20 py-4 flex flex-col gap-4">
      <h3 className="text-2xl">Devices data</h3>
      <TableHeader elements={polishedDeviceTableHeaderElements} />
      <TableComponent<DeviceModel>
        routerPath="/devices"
        apolloQuery={GET_ALL_DEVICES}
        columns={
          defaultColumns as unknown as Array<ColumnDefBase<DeviceModel, string>>
        }
        {...(cityFilter && {
          filters: { location: cityFilter },
        })}
      />
    </div>
  );
};

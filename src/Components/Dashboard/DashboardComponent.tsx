"use Client";

import { useQuery } from "@apollo/client";
import { GET_DEVICE_ACTIVITY } from "@/graphql/schemas/devicesSchema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  DEFAULT_CITY_LATITUDE,
  DEFAULT_CITY_LONGITUDE,
} from "@/constants/magicNumbers";
import toast from "react-hot-toast";
import { Snackbar } from "../SnackBar";
import { LatLngExpression } from "leaflet";
import { ComponentType, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";

dayjs.extend(utc);

export type DeviceActivityReturnType = {
  deviceId: string;
  lastTimeCreated: string;
  latitude: number;
  longitude: number;
  name: string;
  teamName: string;
};

export const DashboardComponent = () => {
  const [startDate, setStartDate] = useState(new Date());
  const defaultPosition: LatLngExpression = [
    DEFAULT_CITY_LATITUDE,
    DEFAULT_CITY_LONGITUDE,
  ];
  const DashboardMap: ComponentType<{
    data: {
      getDevicesLivePosition: {
        data: DeviceActivityReturnType[];
      };
    };
    defaultPosition: LatLngExpression;
  }> = dynamic(() => import("./DasboardMap" as string), {
    ssr: false,
  });
  const { data, error } = useQuery(GET_DEVICE_ACTIVITY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        filters: {
          ...(startDate && { date: startDate }),
        },
      },
    },
  });
  if (error) {
    toast.custom(<Snackbar type="error" message={"Something went wrong"} />);
  }

  return (
    <div className="desktop:h-[88vh] laptop:h-[85vh] overflow-hidden">
      <div className="relative w-full h-full">
        <DatePicker
          showIcon
          selected={startDate}
          onChange={(date) => setStartDate(date as Date)}
          className="border-2 border-primary-40 absolute left-12 top-5 z-50 self-end "
          calendarClassName="top-10 left-14"
        />
        <DashboardMap
          {...{
            data: data,
            defaultPosition: defaultPosition,
          }}
        />
      </div>
    </div>
  );
};

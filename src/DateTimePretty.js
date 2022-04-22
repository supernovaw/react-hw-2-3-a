import React from 'react';
import { DateTime } from "./App";

// checks if the numbers are in range (including month length and Feb 29 case)
const checkDateValidity = (year, month, day, hour, minute, second) => {
  if (year < 0) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  if (hour < 0 || hour > 23) return false;
  if (minute < 0 || minute > 59) return false;
  if (second < 0 || second > 59) return false;

  switch (month) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
      return day <= 31;
    case 4: case 6: case 9: case 11:
      return day <= 30;
    default: break;
  }

  // if we're here, month is 2 (Feb), check if the year is leap
  const m4 = year % 4 === 0;
  const m100 = year % 100 === 0;
  const m400 = year % 400 === 0;
  const canBeLeap = m4 && (!m100 || m400);
  if (canBeLeap) return day <= 29;
  return day <= 28;
};

const verbalDateDifference = (date1, date2) => {
  const diffMins = (date2 - date1) / 60000;
  if (diffMins > 365 * 24 * 60) return Math.floor(diffMins / 60 / 24 / 365) + " years";
  if (diffMins > 30 * 24 * 60) return Math.floor(diffMins / 60 / 24 / 30) + " months";
  if (diffMins > 24 * 60) return Math.floor(diffMins / 60 / 24) + " days";
  if (diffMins > 60) return Math.floor(diffMins / 60) + " hours";
  return Math.floor(diffMins) + " minutes";
};

// stringDate must be yyyy-mm-dd hh:mm:ss
const convertToRelative = (stringDate) => {
  const regex = /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/;
  if (typeof stringDate !== "string" || !regex.test(stringDate))
    throw new Error("invalid date (must be yyyy-mm-dd hh:mm:ss): " + stringDate);

  const parsed = [];
  const push = (from, to) => parsed.push(parseInt(stringDate.substring(from, to), 10));
  push(0, 4); // year
  push(5, 7); // month
  push(8, 10); // day
  push(11, 13); // hour
  push(14, 16); // minute
  push(17, 19); // second

  if (!checkDateValidity(...parsed))
    throw new Error("invalid date (out of bounds): " + stringDate);

  const dateNow = new Date();
  push[1]--; // convert from Jan being 1 to Jan being 0 (from 1..12 to 0..11 format)
  const dateThen = new Date(...parsed);
  if (dateNow < dateThen) return verbalDateDifference(dateNow, dateThen) + " in the future";
  else return verbalDateDifference(dateThen, dateNow) + " ago";
};

export default function DateTimePretty(props) {
  return <DateTime {...props} date={convertToRelative(props.date)} />
};
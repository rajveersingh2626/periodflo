import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../../theme/colors';
import { SpringConfigs } from '../../theme/springs';
import { PeriodCycle, CyclePrediction } from '../../types/cycle';

interface CalendarGridProps {
  currentMonth: Date; // e.g. new Date()
  cycles: PeriodCycle[];
  prediction: CyclePrediction;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  cycles,
  prediction,
  selectedDate,
  onSelectDate,
}) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun

  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Set of logged past period dates
  const loggedPeriodDates = new Set<string>();
  for (const c of cycles) {
    const start = new Date(c.startDate + 'T00:00:00Z');
    const end = new Date(c.endDate + 'T00:00:00Z');
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      loggedPeriodDates.add(d.toISOString().split('T')[0]);
    }
  }

  // Set of predicted period dates
  const predictedPeriodDates = new Set<string>();
  const predStart = new Date(prediction.predictedPeriodStart + 'T00:00:00Z');
  const predEnd = new Date(prediction.predictedPeriodEnd + 'T00:00:00Z');
  for (let d = new Date(predStart); d <= predEnd; d.setUTCDate(d.getUTCDate() + 1)) {
    predictedPeriodDates.add(d.toISOString().split('T')[0]);
  }

  // Set of fertile dates
  const fertileDates = new Set<string>();
  const fertStart = new Date(prediction.fertileWindowStart + 'T00:00:00Z');
  const fertEnd = new Date(prediction.fertileWindowEnd + 'T00:00:00Z');
  for (let d = new Date(fertStart); d <= fertEnd; d.setUTCDate(d.getUTCDate() + 1)) {
    fertileDates.add(d.toISOString().split('T')[0]);
  }

  const renderDays = () => {
    const cells = [];

    // Empty cells before first day
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.emptyCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const isPastPeriod = loggedPeriodDates.has(dateStr);
      const isPredictedPeriod = predictedPeriodDates.has(dateStr);
      const isFertile = fertileDates.has(dateStr);
      const isOvulation = prediction.ovulationDate === dateStr;

      let cellBackground = 'transparent';
      let textColor = Colors.light.textPrimary;

      if (isPastPeriod) {
        cellBackground = Colors.light.periodRed;
        textColor = '#FFFFFF';
      } else if (isPredictedPeriod) {
        cellBackground = Colors.light.predictedPeriod;
        textColor = '#FFFFFF';
      }

      cells.push(
        <Pressable
          key={dateStr}
          onPress={() => onSelectDate(dateStr)}
          style={({ pressed }) => [
            styles.dayCell,
            {
              backgroundColor: cellBackground,
              borderColor: isSelected ? Colors.light.terracotta : 'transparent',
              borderWidth: isSelected ? 2 : 0,
              transform: [{ scale: pressed ? SpringConfigs.tactileScale : 1 }],
            },
          ]}
        >
          <Text style={[styles.dayText, { color: textColor }]}>{day}</Text>
          {isOvulation && <View style={styles.ovulationDot} />}
          {!isOvulation && isFertile && !isPastPeriod && !isPredictedPeriod && (
            <View style={styles.fertileDot} />
          )}
        </Pressable>
      );
    }

    return cells;
  };

  return (
    <View style={styles.container}>
      {/* Weekday headers */}
      <View style={styles.headerRow}>
        {dayHeaders.map((h, i) => (
          <Text key={i} style={styles.headerText}>
            {h}
          </Text>
        ))}
      </View>
      {/* Day grid */}
      <View style={styles.grid}>{renderDays()}</View>
      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: Colors.light.periodRed }]} />
          <Text style={styles.legendText}>Period</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: Colors.light.predictedPeriod }]} />
          <Text style={styles.legendText}>Predicted</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.light.fertileGreen }]} />
          <Text style={styles.legendText}>Fertile</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.light.ovulationPurple }]} />
          <Text style={styles.legendText}>Ovulation</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textMuted,
    width: 36,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  emptyCell: {
    width: 38,
    height: 38,
    marginVertical: 4,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fertileDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.light.fertileGreen,
    position: 'absolute',
    bottom: 3,
  },
  ovulationDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.light.ovulationPurple,
    position: 'absolute',
    bottom: 3,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
});

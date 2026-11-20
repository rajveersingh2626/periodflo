import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { DailyInsightResult } from '../../services/insights/nlgEngine';
import { Sparkles, Activity, BookOpen, SlidersHorizontal } from 'lucide-react-native';

interface DailyInsightCardProps {
  insight: DailyInsightResult;
  isOverridden?: boolean;
  calibrationReason?: string;
  onPressCalibrate?: () => void;
}

export const DailyInsightCard: React.FC<DailyInsightCardProps> = ({
  insight,
  isOverridden = false,
  calibrationReason,
  onPressCalibrate,
}) => {
  const { scientificEvidence } = insight;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Sparkles size={18} color={Colors.light.terracotta} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={styles.eyebrowRow}>
            <Text style={styles.eyebrow}>PHYSIOLOGICAL INTELLIGENCE</Text>
            {isOverridden && (
              <View style={styles.calibratedTag}>
                <Text style={styles.calibratedTagText}>CALIBRATED</Text>
              </View>
            )}
          </View>
          <Text style={styles.phaseTitle}>
            Day {insight.cycleDay} • {insight.phase.toUpperCase()} PHASE
          </Text>
        </View>

        {onPressCalibrate && (
          <TouchableOpacity
            style={[styles.calibrateBtn, isOverridden && styles.calibrateBtnActive]}
            onPress={onPressCalibrate}
            activeOpacity={0.7}
          >
            <SlidersHorizontal
              size={14}
              color={isOverridden ? Colors.light.terracotta : Colors.light.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {isOverridden && calibrationReason && (
        <View style={styles.reasonBanner}>
          <Text style={styles.reasonBannerText}>{calibrationReason}</Text>
        </View>
      )}

      <Text style={styles.narrative}>{insight.primaryNarrative}</Text>

      {/* Hormonal Activity Strip with Estimated Clinical Ranges */}
      <View style={styles.hormoneStrip}>
        <View style={styles.hormoneHeader}>
          <Activity size={14} color={Colors.light.textMuted} />
          <Text style={styles.hormoneLabel}>ESTIMATED SERUM HORMONES</Text>
        </View>
        <View style={styles.hormoneGrid}>
          <View style={styles.hormoneItem}>
            <Text style={styles.hormoneName}>Estradiol</Text>
            <Text style={styles.hormoneValue}>{insight.hormoneStatus.estrogen.toUpperCase()}</Text>
            {insight.hormoneStatus.estimatedEstrogenRange && (
              <Text style={styles.hormoneRange}>
                {insight.hormoneStatus.estimatedEstrogenRange}
              </Text>
            )}
          </View>
          <View style={styles.hormoneItem}>
            <Text style={styles.hormoneName}>Progesterone</Text>
            <Text style={styles.hormoneValue}>
              {insight.hormoneStatus.progesterone.toUpperCase()}
            </Text>
            {insight.hormoneStatus.estimatedProgesteroneRange && (
              <Text style={styles.hormoneRange}>
                {insight.hormoneStatus.estimatedProgesteroneRange}
              </Text>
            )}
          </View>
          <View style={styles.hormoneItem}>
            <Text style={styles.hormoneName}>LH Pulse</Text>
            <Text style={styles.hormoneValue}>{insight.hormoneStatus.lh.toUpperCase()}</Text>
            <Text style={styles.hormoneRange}>
              {insight.hormoneStatus.lh === 'surge' ? '20-100 mIU' : '< 12 mIU'}
            </Text>
          </View>
        </View>
      </View>

      {/* Peer-Reviewed Scientific Evidence Section */}
      {scientificEvidence && (
        <View style={styles.evidenceContainer}>
          <View style={styles.evidenceHeader}>
            <View style={styles.evidenceBadge}>
              <BookOpen size={13} color="#2563EB" />
            </View>
            <Text style={styles.evidenceEyebrow}>EVIDENCE-BASED MECHANISM</Text>
          </View>

          <Text style={styles.evidenceTopic}>{scientificEvidence.topic}</Text>
          <Text style={styles.evidenceMechanism}>{scientificEvidence.mechanism}</Text>

          <View style={styles.takeawayBox}>
            <Text style={styles.takeawayLabel}>CLINICAL TAKEAWAY</Text>
            <Text style={styles.takeawayText}>{scientificEvidence.takeaway}</Text>
          </View>

          <View style={styles.citationRow}>
            <Text style={styles.citationText}>
              {scientificEvidence.clinicalCitation}
            </Text>
            {scientificEvidence.pmid && (
              <View style={styles.pmidPill}>
                <Text style={styles.pmidText}>PMID: {scientificEvidence.pmid}</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    marginVertical: 12,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FBF0EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.terracotta,
    letterSpacing: 1.1,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  narrative: {
    fontSize: 15,
    lineHeight: 23,
    color: Colors.light.textPrimary,
    fontWeight: '400',
  },
  hormoneStrip: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE6',
  },
  hormoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  hormoneLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
  },
  hormoneGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    borderRadius: 14,
    padding: 12,
  },
  hormoneItem: {
    alignItems: 'center',
    flex: 1,
  },
  hormoneName: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  hormoneValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.terracotta,
    marginTop: 3,
  },
  hormoneRange: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  evidenceContainer: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE6',
  },
  evidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  evidenceBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.8,
  },
  evidenceTopic: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 6,
  },
  evidenceMechanism: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.light.textSecondary,
    marginBottom: 10,
  },
  takeawayBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
    marginBottom: 10,
  },
  takeawayLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1E40AF',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  takeawayText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#334155',
    fontWeight: '500',
  },
  citationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  citationText: {
    fontSize: 11,
    color: Colors.light.textMuted,
    fontWeight: '500',
    flex: 1,
  },
  pmidPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pmidText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calibratedTag: {
    backgroundColor: '#FBF0EC',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F5D0C5',
  },
  calibratedTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.light.terracotta,
    letterSpacing: 0.5,
  },
  calibrateBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  calibrateBtnActive: {
    backgroundColor: '#FBF0EC',
    borderColor: '#F5D0C5',
  },
  reasonBanner: {
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 2,
    borderLeftColor: Colors.light.terracotta,
  },
  reasonBannerText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
});

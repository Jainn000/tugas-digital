import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getVendorJobs, updateVendorJobStatus } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Akses terbatas untuk akun mitra vendor terdaftar.' },
        { status: 403 }
      );
    }

    const jobs = await getVendorJobs();

    const totalPO = jobs.reduce((sum, j) => sum + (Number(j.po_amount) || 0), 0);
    const totalPaid = jobs.reduce((sum, j) => sum + (Number(j.paid_amount) || 0), 0);
    const activeJobs = jobs.filter(j => j.job_status !== 'selesai').length;
    const completedJobs = jobs.filter(j => j.job_status === 'selesai').length;

    return NextResponse.json({
      success: true,
      jobs,
      metrics: {
        totalPO,
        totalPaid,
        remainingPO: totalPO - totalPaid,
        activeJobs,
        completedJobs,
        totalJobs: jobs.length,
      },
      vendorInfo: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Gagal mengambil data penugasan vendor.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Akses terbatas untuk akun mitra vendor.' },
        { status: 403 }
      );
    }

    const { job_id, status } = await req.json();
    if (!job_id || !status) {
      return NextResponse.json(
        { error: 'ID pekerjaan dan status baru wajib disertakan.' },
        { status: 400 }
      );
    }

    const validStatuses = [
      'menunggu_konfirmasi',
      'persiapan_alat',
      'loading_venue',
      'ready_soundcheck',
      'selesai',
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status pengerjaan tidak valid.' },
        { status: 400 }
      );
    }

    const updated = await updateVendorJobStatus(job_id, status);
    if (!updated) {
      return NextResponse.json(
        { error: 'Surat perintah kerja tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Status pengerjaan berhasil diperbarui.',
      job: updated,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Gagal memperbarui status penugasan.' },
      { status: 500 }
    );
  }
}
